package com.emoney.nfcbalance;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.emoney.nfcbalance.model.CardInfo;
import com.emoney.nfcbalance.nfc.NfcCardReader;
import com.emoney.nfcbalance.toll.TollDataHelper;
import com.emoney.nfcbalance.utils.SoundVibrationHelper;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.card.MaterialCardView;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity {

    private NfcAdapter nfcAdapter;
    private PendingIntent pendingIntent;
    private IntentFilter[] intentFiltersArray;
    private String[][] techListsArray;

    // State 1: Home
    private LinearLayout layoutStateHome;
    private MaterialButton btnMainScanNfc;
    private MaterialButton btnMainTollCalc;
    private FloatingActionButton fabScan;

    // State 2: Result
    private LinearLayout layoutStateResult;
    private MaterialCardView cardFrontPortrait;
    private TextView tvFrontCardHolder;
    private TextView tvCardBankTitle;
    private TextView tvCardProductBadge;
    private TextView tvCardNumberOnCard;
    private View viewCardCircle1;
    private View viewCardCircle2;

    private TextView tvResultIssuerLabel;
    private TextView tvResultBalanceAmount;
    private EditText etResultCardNumber;
    private EditText etResultCardHolder;
    private MaterialButton btnResultTollCalc;
    private MaterialButton btnContinueOrRescan;

    private TextView btnNavBack;
    private TextView btnSkipOrAction;

    private BottomSheetDialog scanDialog;
    private BottomSheetDialog tollDialog;
    private CardInfo lastScannedCard = null;
    private int selectedGolonganIdx = 0;
    private TollDataHelper.Gate selectedAsalGate = null;
    private TollDataHelper.Gate selectedTujuanGate = null;
    private TollDataHelper.TollResult currentLegResult = null;

    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initViews();
        initNfc();
        setupListeners();

        if (getIntent() != null) {
            handleNfcIntent(getIntent());
        }
    }

    private void initViews() {
        layoutStateHome = findViewById(R.id.layoutStateHome);
        btnMainScanNfc = findViewById(R.id.btnMainScanNfc);
        fabScan = findViewById(R.id.fabScan);

        layoutStateResult = findViewById(R.id.layoutStateResult);
        cardFrontPortrait = findViewById(R.id.cardFrontPortrait);
        tvFrontCardHolder = findViewById(R.id.tvFrontCardHolder);
        tvCardBankTitle = findViewById(R.id.tvCardBankTitle);
        tvCardProductBadge = findViewById(R.id.tvCardProductBadge);
        tvCardNumberOnCard = findViewById(R.id.tvCardNumberOnCard);
        viewCardCircle1 = findViewById(R.id.viewCardCircle1);
        viewCardCircle2 = findViewById(R.id.viewCardCircle2);

        tvResultIssuerLabel = findViewById(R.id.tvResultIssuerLabel);
        tvResultBalanceAmount = findViewById(R.id.tvResultBalanceAmount);
        etResultCardNumber = findViewById(R.id.etResultCardNumber);
        etResultCardHolder = findViewById(R.id.etResultCardHolder);
        btnMainTollCalc = findViewById(R.id.btnMainTollCalc);
        btnResultTollCalc = findViewById(R.id.btnResultTollCalc);
        btnContinueOrRescan = findViewById(R.id.btnContinueOrRescan);

        btnNavBack = findViewById(R.id.btnNavBack);
        btnSkipOrAction = findViewById(R.id.btnSkipOrAction);
    }

    private void initNfc() {
        nfcAdapter = NfcAdapter.getDefaultAdapter(this);

        Intent nfcIntent = new Intent(this, getClass()).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            flags |= PendingIntent.FLAG_MUTABLE;
        }
        pendingIntent = PendingIntent.getActivity(this, 0, nfcIntent, flags);

        IntentFilter techFilter = new IntentFilter(NfcAdapter.ACTION_TECH_DISCOVERED);
        intentFiltersArray = new IntentFilter[]{techFilter};

        techListsArray = new String[][]{
                new String[]{"android.nfc.tech.IsoDep"},
                new String[]{"android.nfc.tech.MifareClassic"},
                new String[]{"android.nfc.tech.NfcA"}
        };
    }

    private void setupListeners() {
        View.OnClickListener openScannerListener = v -> openScanningModal();
        btnMainScanNfc.setOnClickListener(openScannerListener);
        fabScan.setOnClickListener(openScannerListener);

        View.OnClickListener openTollCalcListener = v -> showTollCalculatorDialog();
        if (btnMainTollCalc != null) btnMainTollCalc.setOnClickListener(openTollCalcListener);
        if (btnResultTollCalc != null) btnResultTollCalc.setOnClickListener(openTollCalcListener);

        btnContinueOrRescan.setOnClickListener(v -> resetToHome());
        btnNavBack.setOnClickListener(v -> resetToHome());

        btnSkipOrAction.setOnClickListener(v -> showAlgorithmDialog());
    }

    /**
     * Membuka Dialog Native Pemindaian NFC (Screen 3)
     */
    private void openScanningModal() {
        if (nfcAdapter == null) {
            Toast.makeText(this, "Perangkat Anda tidak mendukung fitur NFC fisik", Toast.LENGTH_LONG).show();
        } else if (!nfcAdapter.isEnabled()) {
            new AlertDialog.Builder(this)
                    .setTitle("NFC Belum Aktif")
                    .setMessage("Silakan aktifkan NFC di menu Pengaturan smartphone untuk memindai kartu.")
                    .setPositiveButton("Buka Pengaturan", (d, w) -> startActivity(new Intent(Settings.ACTION_NFC_SETTINGS)))
                    .setNegativeButton("Batal", null)
                    .show();
            return;
        }

        scanDialog = new BottomSheetDialog(this);
        View dialogView = getLayoutInflater().inflate(R.layout.dialog_scan_nfc, null);
        scanDialog.setContentView(dialogView);

        dialogView.findViewById(R.id.btnDialogClose).setOnClickListener(v -> scanDialog.dismiss());
        scanDialog.show();
    }

    private void displaySimulatedCard(int index) {
        CardInfo[] simCards = new CardInfo[]{
                new CardInfo("Mandiri e-Money", "6032 •••• •••• 8192", "04:A2:38:B1:92:44", 85000, "Rp 85.000", false, "ISO-DEP (ISO 14443-4)"),
                new CardInfo("BCA Flazz", "5241 •••• •••• 1042", "04:88:E1:C2:55:12", 124500, "Rp 124.500", false, "ISO-DEP (DESFire EV2)"),
                new CardInfo("BNI TapCash", "7001 •••• •••• 4409", "04:3F:19:9A:88:71", 50000, "Rp 50.000", false, "ISO-DEP (ISO 14443-4)"),
                new CardInfo("BRI Brizzi", "5379 •••• •••• 6231", "04:B4:77:2D:10:99", 37000, "Rp 37.000", false, "ISO-DEP (ISO 14443-4)"),
                new CardInfo("Bank DKI JakCard", "1010 •••• •••• 5920", "04:C5:11:09:A1:33", 45000, "Rp 45.000", false, "ISO-DEP (ISO 14443-4)")
        };
        CardInfo selected = simCards[index % simCards.length];
        SoundVibrationHelper.triggerSuccess(this);
        displayCard(selected);
    }

    private void displayCard(CardInfo card) {
        this.lastScannedCard = card;
        layoutStateHome.setVisibility(View.GONE);
        layoutStateResult.setVisibility(View.VISIBLE);
        fabScan.setVisibility(View.GONE);

        tvFrontCardHolder.setVisibility(View.GONE);
        tvFrontCardHolder.setText("");
        tvResultIssuerLabel.setText("SALDO CHIP e-MONEY (" + card.getCardName() + "):");
        tvResultBalanceAmount.setText(card.getFormattedBalance());
        etResultCardNumber.setText(card.getCardNumber());
        etResultCardHolder.setText(card.getCardName());
        tvCardNumberOnCard.setText(card.getCardNumber());

        String cardName = card.getCardName() != null ? card.getCardName() : "";
        String lowerName = cardName.toLowerCase();

        // Tampilkan gambar kartu otentik sesuai bank yang di-tap
        if (lowerName.contains("mandiri")) {
            cardFrontPortrait.setCardBackgroundColor(Color.parseColor("#041B37"));
            cardFrontPortrait.setStrokeColor(Color.parseColor("#80F59E0B"));
            tvCardBankTitle.setText("MANDIRI");
            tvCardProductBadge.setText("e-money");
            tvCardProductBadge.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#F59E0B")));
            tvCardProductBadge.setTextColor(Color.parseColor("#041B37"));
            if (viewCardCircle1 != null) viewCardCircle1.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#F59E0B")));
            if (viewCardCircle2 != null) viewCardCircle2.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#D97706")));
        } else if (lowerName.contains("flazz") || lowerName.contains("bca")) {
            cardFrontPortrait.setCardBackgroundColor(Color.parseColor("#003A70"));
            cardFrontPortrait.setStrokeColor(Color.parseColor("#8000D2FF"));
            tvCardBankTitle.setText("BCA");
            tvCardProductBadge.setText("Flazz");
            tvCardProductBadge.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#00D2FF")));
            tvCardProductBadge.setTextColor(Color.parseColor("#00284D"));
            if (viewCardCircle1 != null) viewCardCircle1.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#00D2FF")));
            if (viewCardCircle2 != null) viewCardCircle2.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#E02475")));
        } else if (lowerName.contains("tapcash") || lowerName.contains("bni")) {
            cardFrontPortrait.setCardBackgroundColor(Color.parseColor("#053C3F"));
            cardFrontPortrait.setStrokeColor(Color.parseColor("#80F97316"));
            tvCardBankTitle.setText("BNI");
            tvCardProductBadge.setText("TapCash");
            tvCardProductBadge.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#F97316")));
            tvCardProductBadge.setTextColor(Color.WHITE);
            if (viewCardCircle1 != null) viewCardCircle1.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#F97316")));
            if (viewCardCircle2 != null) viewCardCircle2.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#0D9488")));
        } else if (lowerName.contains("brizzi") || lowerName.contains("bri")) {
            cardFrontPortrait.setCardBackgroundColor(Color.parseColor("#003366"));
            cardFrontPortrait.setStrokeColor(Color.parseColor("#80FF6600"));
            tvCardBankTitle.setText("BRI");
            tvCardProductBadge.setText("BRIZZI");
            tvCardProductBadge.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#FF6600")));
            tvCardProductBadge.setTextColor(Color.WHITE);
            if (viewCardCircle1 != null) viewCardCircle1.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#FF6600")));
            if (viewCardCircle2 != null) viewCardCircle2.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#0284C7")));
        } else if (lowerName.contains("jakcard") || lowerName.contains("dki")) {
            cardFrontPortrait.setCardBackgroundColor(Color.parseColor("#7F1D1D"));
            cardFrontPortrait.setStrokeColor(Color.parseColor("#80F59E0B"));
            tvCardBankTitle.setText("Bank DKI");
            tvCardProductBadge.setText("JakCard");
            tvCardProductBadge.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#F59E0B")));
            tvCardProductBadge.setTextColor(Color.parseColor("#7F1D1D"));
            if (viewCardCircle1 != null) viewCardCircle1.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#F59E0B")));
            if (viewCardCircle2 != null) viewCardCircle2.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#991B1B")));
        } else {
            cardFrontPortrait.setCardBackgroundColor(Color.parseColor("#0F172A"));
            cardFrontPortrait.setStrokeColor(Color.parseColor("#406366F1"));
            tvCardBankTitle.setText("SMART");
            tvCardProductBadge.setText("CARD");
            tvCardProductBadge.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#6366F1")));
            tvCardProductBadge.setTextColor(Color.WHITE);
        }
    }

    private void resetToHome() {
        layoutStateResult.setVisibility(View.GONE);
        layoutStateHome.setVisibility(View.VISIBLE);
        fabScan.setVisibility(View.VISIBLE);
    }

    private void showAlgorithmDialog() {
        new AlertDialog.Builder(this)
                .setTitle("Algoritma APDU e-Money Offline")
                .setMessage("Daftar Library GitHub:\n" +
                        "1. agusibrahim/prepaidcard_reader (Flutter & Java Native)\n" +
                        "2. adrisinaga/nfc_reader (Android IsoDep)\n\n" +
                        "Protokol Offline (ISO 14443-4):\n" +
                        "• Mandiri e-Money: Select AID A000000018300001 -> Read Record 00B2010400 (Byte 12..15)\n" +
                        "• BCA Flazz: Select AID A0000000180F0000018001 -> Select File 0200 -> Read Balance 8032000304\n" +
                        "• BNI TapCash: Select AID 112233445566 -> Read Balance 9032030000\n" +
                        "• BRI Brizzi: Select AID A000000018300001 -> Read Balance 906C000000\n" +
                        "• Bank DKI JakCard: Select AID A000000018300001 -> Read Balance 904C000000\n\n" +
                        "Semua pembacaan berjalan 100% offline langsung dari chip NFC smartphone.")
                .setPositiveButton("Tutup", null)
                .show();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (nfcAdapter != null && nfcAdapter.isEnabled()) {
            nfcAdapter.enableForegroundDispatch(this, pendingIntent, intentFiltersArray, techListsArray);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (nfcAdapter != null) {
            nfcAdapter.disableForegroundDispatch(this);
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleNfcIntent(intent);
    }

    private void handleNfcIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();

        if (NfcAdapter.ACTION_TECH_DISCOVERED.equals(action) ||
                NfcAdapter.ACTION_TAG_DISCOVERED.equals(action) ||
                NfcAdapter.ACTION_NDEF_DISCOVERED.equals(action)) {

            Tag tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
            if (tag != null) {
                if (scanDialog != null && scanDialog.isShowing()) {
                    scanDialog.dismiss();
                }

                executorService.execute(() -> {
                    CardInfo cardInfo = NfcCardReader.parseTag(tag);
                    runOnUiThread(() -> {
                        if (cardInfo != null) {
                            SoundVibrationHelper.triggerSuccess(this);
                            displayCard(cardInfo);
                        } else {
                            Toast.makeText(this, "Gagal mengurai kartu", Toast.LENGTH_SHORT).show();
                        }
                    });
                });
            }
        }
    }

    private void showTollCalculatorDialog() {
        tollDialog = new BottomSheetDialog(this);
        View view = getLayoutInflater().inflate(R.layout.dialog_toll_calculator, null);
        tollDialog.setContentView(view);

        TextView btnClose = view.findViewById(R.id.btnCloseTollDialog);
        View boxPilihGolongan = view.findViewById(R.id.boxPilihGolongan);
        TextView tvSelectedGolongan = view.findViewById(R.id.tvSelectedGolongan);

        View boxGerbangAsal = view.findViewById(R.id.boxGerbangAsal);
        TextView tvSelectedAsal = view.findViewById(R.id.tvSelectedAsal);

        View boxGerbangTujuan = view.findViewById(R.id.boxGerbangTujuan);
        TextView tvSelectedTujuan = view.findViewById(R.id.tvSelectedTujuan);

        MaterialButton btnBersihkanTarif = view.findViewById(R.id.btnBersihkanTarif);

        TextView tvTotalTarifAmount = view.findViewById(R.id.tvTotalTarifAmount);
        TextView tvBalanceComparisonStatus = view.findViewById(R.id.tvBalanceComparisonStatus);
        LinearLayout layoutRincianRuas = view.findViewById(R.id.layoutRincianRuas);
        TextView tvRincianSegmentsContent = view.findViewById(R.id.tvRincianSegmentsContent);

        String[] golonganNames = new String[]{
                "Golongan I (Sedan, Jip, Pick Up, Bus, Truk Kecil)",
                "Golongan II (Truk dengan 2 gandar)",
                "Golongan III (Truk dengan 3 gandar)",
                "Golongan IV (Truk dengan 4 gandar)",
                "Golongan V (Truk dengan 5 gandar / lebih)"
        };

        String[] golonganShort = new String[]{
                "Golongan I", "Golongan II", "Golongan III", "Golongan IV", "Golongan V"
        };

        tvSelectedGolongan.setText(golonganShort[selectedGolonganIdx]);
        if (selectedAsalGate != null) {
            tvSelectedAsal.setText(selectedAsalGate.name);
            tvSelectedAsal.setTextColor(Color.parseColor("#0F172A"));
        } else {
            tvSelectedAsal.setText("Gerbang Asal");
            tvSelectedAsal.setTextColor(Color.parseColor("#94A3B8"));
        }

        if (selectedTujuanGate != null) {
            tvSelectedTujuan.setText(selectedTujuanGate.name);
            tvSelectedTujuan.setTextColor(Color.parseColor("#0F172A"));
        } else {
            tvSelectedTujuan.setText("Gerbang Tujuan");
            tvSelectedTujuan.setTextColor(Color.parseColor("#94A3B8"));
        }

        btnClose.setOnClickListener(v -> tollDialog.dismiss());

        Runnable updateUI = () -> {
            long total = 0;

            if (selectedAsalGate != null && selectedTujuanGate != null) {
                currentLegResult = TollDataHelper.calculateRoute(selectedAsalGate.id, selectedTujuanGate.id, selectedGolonganIdx);
                if (currentLegResult.success) {
                    total = currentLegResult.totalFee;
                }
            } else {
                currentLegResult = null;
            }

            tvTotalTarifAmount.setText(TollDataHelper.formatRupiah(total));

            // Breakdown
            StringBuilder sb = new StringBuilder();
            if (currentLegResult != null && currentLegResult.success) {
                for (TollDataHelper.Segment s : currentLegResult.segments) {
                    sb.append("• ").append(s.ruasName).append(" (").append(s.fromName).append(" ➔ ").append(s.toName).append("): ").append(TollDataHelper.formatRupiah(s.fee)).append("\n");
                }
                sb.append("Jarak Tempuh: ±").append(currentLegResult.distanceKm).append(" KM");
            }

            if (sb.length() > 0) {
                layoutRincianRuas.setVisibility(View.VISIBLE);
                tvRincianSegmentsContent.setText(sb.toString().trim());
            } else {
                layoutRincianRuas.setVisibility(View.GONE);
            }

            // Balance Comparison
            if (lastScannedCard != null) {
                tvBalanceComparisonStatus.setVisibility(View.VISIBLE);
                long cardBal = lastScannedCard.getBalance();
                if (cardBal >= total) {
                    long diff = cardBal - total;
                    tvBalanceComparisonStatus.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#DCFCE7")));
                    tvBalanceComparisonStatus.setTextColor(Color.parseColor("#15803D"));
                    tvBalanceComparisonStatus.setText("✅ Saldo (" + TollDataHelper.formatRupiah(cardBal) + ") Cukup. Sisa: " + TollDataHelper.formatRupiah(diff));
                } else {
                    long diff = total - cardBal;
                    tvBalanceComparisonStatus.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#FEE2E2")));
                    tvBalanceComparisonStatus.setTextColor(Color.parseColor("#B91C1C"));
                    tvBalanceComparisonStatus.setText("⚠️ Saldo (" + TollDataHelper.formatRupiah(cardBal) + ") Kurang: " + TollDataHelper.formatRupiah(diff) + ". Segera Top Up!");
                }
            } else {
                tvBalanceComparisonStatus.setVisibility(View.GONE);
            }
        };

        updateUI.run();

        // 1. Pilih Golongan
        boxPilihGolongan.setOnClickListener(v -> {
            new AlertDialog.Builder(this)
                    .setTitle("Pilih Golongan Kendaraan")
                    .setSingleChoiceItems(golonganNames, selectedGolonganIdx, (d, which) -> {
                        selectedGolonganIdx = which;
                        tvSelectedGolongan.setText(golonganShort[which]);
                        d.dismiss();
                        updateUI.run();
                    })
                    .setNegativeButton("Batal", null)
                    .show();
        });

        // 2. Pilih Gerbang Asal (Dengan Fitur Pencarian)
        boxGerbangAsal.setOnClickListener(v -> {
            openGateSearchDialog(true, () -> {
                if (selectedAsalGate != null) {
                    tvSelectedAsal.setText(selectedAsalGate.name);
                    tvSelectedAsal.setTextColor(Color.parseColor("#0F172A"));
                    updateUI.run();
                }
            });
        });

        // 3. Pilih Gerbang Tujuan (Dengan Fitur Pencarian)
        boxGerbangTujuan.setOnClickListener(v -> {
            openGateSearchDialog(false, () -> {
                if (selectedTujuanGate != null) {
                    tvSelectedTujuan.setText(selectedTujuanGate.name);
                    tvSelectedTujuan.setTextColor(Color.parseColor("#0F172A"));
                    updateUI.run();
                }
            });
        });

        // 4. Bersihkan Tarif
        btnBersihkanTarif.setOnClickListener(v -> {
            selectedAsalGate = null;
            selectedTujuanGate = null;
            tvSelectedAsal.setText("Gerbang Asal");
            tvSelectedAsal.setTextColor(Color.parseColor("#94A3B8"));
            tvSelectedTujuan.setText("Gerbang Tujuan");
            tvSelectedTujuan.setTextColor(Color.parseColor("#94A3B8"));
            updateUI.run();
            Toast.makeText(this, "Tarif berhasil dibersihkan", Toast.LENGTH_SHORT).show();
        });

        tollDialog.show();
    }

    /**
     * Dialog Pencarian Gerbang Tol Interaktif (Live Search) untuk Gerbang Asal & Tujuan
     */
    private void openGateSearchDialog(boolean isAsal, Runnable onSelected) {
        BottomSheetDialog gateDialog = new BottomSheetDialog(this);
        View dialogView = getLayoutInflater().inflate(R.layout.dialog_select_gate, null);
        gateDialog.setContentView(dialogView);

        TextView tvTitle = dialogView.findViewById(R.id.tvGateDialogTitle);
        TextView btnClose = dialogView.findViewById(R.id.btnCloseGateDialog);
        EditText etSearch = dialogView.findViewById(R.id.etGateSearch);
        TextView btnClear = dialogView.findViewById(R.id.btnClearGateSearch);
        ListView lvGates = dialogView.findViewById(R.id.lvGates);
        TextView tvEmpty = dialogView.findViewById(R.id.tvGateEmpty);

        tvTitle.setText(isAsal ? "Pilih Gerbang Asal (Masuk)" : "Pilih Gerbang Tujuan (Keluar)");
        etSearch.setHint(isAsal ? "Cari gerbang asal (misal: Dupak, Waru, Malang)..." : "Cari gerbang tujuan (misal: Madiun, Pasuruan)...");

        btnClose.setOnClickListener(v -> gateDialog.dismiss());

        List<TollDataHelper.Gate> allGates = TollDataHelper.getAllGates();
        List<TollDataHelper.Gate> currentList = new ArrayList<>(allGates);

        BaseAdapter adapter = new BaseAdapter() {
            @Override
            public int getCount() {
                return currentList.size();
            }

            @Override
            public Object getItem(int position) {
                return currentList.get(position);
            }

            @Override
            public long getItemId(int position) {
                return position;
            }

            @Override
            public View getView(int position, View convertView, ViewGroup parent) {
                if (convertView == null) {
                    convertView = getLayoutInflater().inflate(R.layout.item_gate_select, parent, false);
                }
                TollDataHelper.Gate gate = currentList.get(position);
                TextView tvName = convertView.findViewById(R.id.tvGateItemName);
                TextView tvDetail = convertView.findViewById(R.id.tvGateItemDetail);
                TextView tvKm = convertView.findViewById(R.id.tvGateItemKm);

                tvName.setText(gate.name);
                tvDetail.setText(gate.wilayah + " • " + gate.ruas);
                tvKm.setText("KM " + gate.km);

                return convertView;
            }
        };

        lvGates.setAdapter(adapter);

        // Filter realtime saat pengguna mengetik
        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                String query = s.toString().trim().toLowerCase();
                btnClear.setVisibility(query.length() > 0 ? View.VISIBLE : View.GONE);

                currentList.clear();
                if (query.isEmpty()) {
                    currentList.addAll(allGates);
                } else {
                    for (TollDataHelper.Gate g : allGates) {
                        if (g.name.toLowerCase().contains(query) ||
                                g.wilayah.toLowerCase().contains(query) ||
                                g.ruas.toLowerCase().contains(query)) {
                            currentList.add(g);
                        }
                    }
                }
                adapter.notifyDataSetChanged();
                tvEmpty.setVisibility(currentList.isEmpty() ? View.VISIBLE : View.GONE);
                lvGates.setVisibility(currentList.isEmpty() ? View.GONE : View.VISIBLE);
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });

        btnClear.setOnClickListener(v -> etSearch.setText(""));

        lvGates.setOnItemClickListener((parent, view, position, id) -> {
            TollDataHelper.Gate selected = currentList.get(position);
            if (isAsal) {
                selectedAsalGate = selected;
            } else {
                selectedTujuanGate = selected;
            }
            gateDialog.dismiss();
            if (onSelected != null) {
                onSelected.run();
            }
        });

        gateDialog.show();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        executorService.shutdown();
    }
}
