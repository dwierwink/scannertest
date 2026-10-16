package com.emoney.nfcbalance.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.emoney.nfcbalance.R;
import com.emoney.nfcbalance.model.CardInfo;

import java.util.ArrayList;
import java.util.List;

public class ScanHistoryAdapter extends RecyclerView.Adapter<ScanHistoryAdapter.ViewHolder> {

    public interface OnItemClickListener {
        void onItemClick(CardInfo card);
    }

    private final List<CardInfo> items = new ArrayList<>();
    private final OnItemClickListener listener;

    public ScanHistoryAdapter(OnItemClickListener listener) {
        this.listener = listener;
    }

    public void setData(List<CardInfo> newItems) {
        this.items.clear();
        if (newItems != null) {
            this.items.addAll(newItems);
        }
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_scan_history, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        CardInfo card = items.get(position);
        holder.tvIssuer.setText(card.getCardName());
        holder.tvNumber.setText(card.getCardNumber());
        holder.tvTimestamp.setText(card.getFormattedTimestamp());
        holder.tvTech.setText(card.getTechnology());

        if (card.isEncrypted()) {
            holder.tvBalance.setText("Terkunci");
            holder.tvBalance.setTextColor(0xFFF59E0B); // Amber warning
        } else {
            holder.tvBalance.setText(card.getFormattedBalance());
            holder.tvBalance.setTextColor(0xFF10B981); // Emerald green
        }

        holder.itemView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onItemClick(card);
            }
        });
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        final TextView tvIssuer;
        final TextView tvNumber;
        final TextView tvTimestamp;
        final TextView tvBalance;
        final TextView tvTech;
        final ImageView ivIcon;

        ViewHolder(@NonNull View itemView) {
            super(itemView);
            tvIssuer = itemView.findViewById(R.id.tvItemCardIssuer);
            tvNumber = itemView.findViewById(R.id.tvItemCardNumber);
            tvTimestamp = itemView.findViewById(R.id.tvItemTimestamp);
            tvBalance = itemView.findViewById(R.id.tvItemBalance);
            tvTech = itemView.findViewById(R.id.tvItemTech);
            ivIcon = itemView.findViewById(R.id.ivItemCardIcon);
        }
    }
}
