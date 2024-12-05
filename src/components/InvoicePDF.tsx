import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { Invoice } from '../types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    color: '#6B46C1',
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.5,
  },
  header: {
    marginBottom: 30,
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  label: {
    width: 120,
    color: '#4B5563',
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  value: {
    flex: 1,
    color: '#1F2937',
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  billingSection: {
    marginTop: 25,
    marginBottom: 25,
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  billingSectionRow: {
    flexDirection: 'row',
    gap: 40,
  },
  billingSectionColumn: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#6B46C1',
    marginBottom: 12,
    fontFamily: 'Helvetica-Bold',
  },
  billingDetails: {
    fontSize: 11,
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 1.4,
  },
  table: {
    marginTop: 25,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#6B46C1',
    padding: 12,
    borderRadius: 8,
  },
  tableHeaderText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderBottomStyle: 'solid',
    padding: 12,
  },
  tableCell: {
    fontSize: 11,
    color: '#1F2937',
  },
  description: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  tableCellAmount: {
    fontFamily: 'Helvetica-Bold',
  },
  col1: { width: '40%' },
  col2: { width: '20%' },
  col3: { width: '20%' },
  col4: { width: '20%' },
  total: {
    marginTop: 30,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  totalLabel: {
    width: 100,
    textAlign: 'right',
    paddingRight: 20,
    fontSize: 12,
    color: '#4B5563',
    fontFamily: 'Helvetica-Bold',
  },
  totalValue: {
    width: 120,
    textAlign: 'right',
    fontSize: 12,
    color: '#1F2937',
    fontFamily: 'Helvetica-Bold',
  },
  totalAmount: {
    fontSize: 14,
    color: '#6B46C1',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 10,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
});

interface InvoicePDFProps {
  invoice: Invoice;
  companyName: string;
  footerText: string;
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice, companyName, footerText }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{companyName}</Text>

      <View style={styles.header}>
        <View style={styles.row}>
          <Text style={styles.label}>Invoice No #</Text>
          <Text style={styles.value}>{invoice.number}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Invoice Date</Text>
          <Text style={styles.value}>{format(invoice.date, 'MMMM dd, yyyy')}</Text>
        </View>
        {invoice.dueDate && (
          <View style={styles.row}>
            <Text style={styles.label}>Due Date</Text>
            <Text style={styles.value}>{format(invoice.dueDate, 'MMMM dd, yyyy')}</Text>
          </View>
        )}
      </View>

      <View style={styles.billingSection}>
        <View style={styles.billingSectionRow}>
          <View style={styles.billingSectionColumn}>
            <Text style={styles.sectionTitle}>Billed By</Text>
            <Text style={styles.billingDetails}>{invoice.billedBy.name}</Text>
            <Text style={styles.billingDetails}>{invoice.billedBy.address}</Text>
          </View>
          <View style={styles.billingSectionColumn}>
            <Text style={styles.sectionTitle}>Billed To</Text>
            {invoice.billedTo && (
              <>
                <Text style={styles.billingDetails}>{invoice.billedTo.name}</Text>
                <Text style={styles.billingDetails}>{invoice.billedTo.business.address}</Text>
              </>
            )}
          </View>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { width: '40%' }]}>Item</Text>
          <Text style={[styles.tableHeaderText, { width: '20%' }]}>Quantity</Text>
          <Text style={[styles.tableHeaderText, { width: '20%' }]}>Rate</Text>
          <Text style={[styles.tableHeaderText, { width: '20%' }]}>Amount</Text>
        </View>
        {invoice.items.map((item, index) => (
          <View key={item.id} style={[
            styles.tableRow,
            index % 2 === 0 ? { backgroundColor: '#F9FAFB' } : {}
          ]}>
            <View style={{ width: '40%' }}>
              <Text style={styles.tableCell}>{item.name}</Text>
              {item.description && (
                <Text style={styles.description}>{item.description}</Text>
              )}
            </View>
            <Text style={[styles.tableCell, { width: '20%' }]}>{item.quantity}</Text>
            <Text style={[styles.tableCell, { width: '20%' }]}>
              {invoice.currency} {item.rate.toLocaleString()}
            </Text>
            <Text style={[styles.tableCell, styles.tableCellAmount, { width: '20%' }]}>
              {invoice.currency} {item.amount.toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.total}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>
            {invoice.currency} {invoice.subtotal.toLocaleString()}
          </Text>
        </View>
        {invoice.tax && invoice.tax > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>
              {invoice.currency} {invoice.tax.toLocaleString()}
            </Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, styles.totalAmount]}>Total</Text>
          <Text style={[styles.totalValue, styles.totalAmount]}>
            {invoice.currency} {invoice.total.toLocaleString()}
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>{footerText}</Text>
    </Page>
  </Document>
);