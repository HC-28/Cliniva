package com.cliniva.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bills")
public class Bill extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
    
    @Column(name = "bill_number", unique = true, length = 50, nullable = false)
    private String billNumber;

    @Column(name = "bill_date", nullable = false)
    private LocalDate billDate;
    
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "bill_type", nullable = false, length = 50)
    private BillType billType;
    
    @Column(name = "item_name", nullable = false, length = 200)
    private String itemName;
    
    @Column(name = "item_description", length = 1000)
    private String itemDescription;
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;
    
    @Column(name = "tax_percentage")
    private BigDecimal taxPercentage;
    
    @Column(name = "tax_amount")
    private BigDecimal taxAmount;
    
    @Column(name = "discount_percentage")
    private BigDecimal discountPercentage;
    
    @Column(name = "discount_amount")
    private BigDecimal discountAmount;
    
    @Column(name = "final_amount", nullable = false)
    private BigDecimal finalAmount;
    
    @Column(name = "paid_amount", nullable = false)
    private BigDecimal paidAmount = BigDecimal.ZERO;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BillStatus status;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    private PaymentStatus paymentStatus;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 20)
    private PaymentMethod paymentMethod;
    
    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
    
    @Column(name = "payment_reference", length = 100)
    private String paymentReference;

    @Column(name = "transaction_id", length = 100)
    private String transactionId;
    
    @Column(name = "notes", length = 1000)
    private String notes;
    
    @Column(name = "is_insurance_covered")
    private Boolean isInsuranceCovered = false;
    
    @Column(name = "insurance_provider", length = 100)
    private String insuranceProvider;
    
    @Column(name = "insurance_policy_number", length = 50)
    private String insurancePolicyNumber;
    
    @Column(name = "insurance_claim_status", length = 20)
    private String insuranceClaimStatus;

    public Bill() {}

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }
    public String getBillNumber() { return billNumber; }
    public void setBillNumber(String billNumber) { this.billNumber = billNumber; }
    public LocalDate getBillDate() { return billDate; }
    public void setBillDate(LocalDate billDate) { this.billDate = billDate; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public BillType getBillType() { return billType; }
    public void setBillType(BillType billType) { this.billType = billType; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public String getItemDescription() { return itemDescription; }
    public void setItemDescription(String itemDescription) { this.itemDescription = itemDescription; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public BigDecimal getTaxPercentage() { return taxPercentage; }
    public void setTaxPercentage(BigDecimal taxPercentage) { this.taxPercentage = taxPercentage; }
    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }
    public BigDecimal getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(BigDecimal discountPercentage) { this.discountPercentage = discountPercentage; }
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }
    public BigDecimal getFinalAmount() { return finalAmount; }
    public void setFinalAmount(BigDecimal finalAmount) { this.finalAmount = finalAmount; }
    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }
    public BillStatus getStatus() { return status; }
    public void setStatus(BillStatus status) { this.status = status; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }
    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Boolean getIsInsuranceCovered() { return isInsuranceCovered; }
    public void setIsInsuranceCovered(Boolean isInsuranceCovered) { this.isInsuranceCovered = isInsuranceCovered; }
    public String getInsuranceProvider() { return insuranceProvider; }
    public void setInsuranceProvider(String insuranceProvider) { this.insuranceProvider = insuranceProvider; }
    public String getInsurancePolicyNumber() { return insurancePolicyNumber; }
    public void setInsurancePolicyNumber(String insurancePolicyNumber) { this.insurancePolicyNumber = insurancePolicyNumber; }
    public String getInsuranceClaimStatus() { return insuranceClaimStatus; }
    public void setInsuranceClaimStatus(String insuranceClaimStatus) { this.insuranceClaimStatus = insuranceClaimStatus; }

    
    public BigDecimal getRemainingAmount() {
        if (finalAmount == null) return BigDecimal.ZERO;
        return finalAmount.subtract(paidAmount != null ? paidAmount : BigDecimal.ZERO);
    }
    
    public boolean isPaid() {
        return (finalAmount != null && paidAmount != null) && (paidAmount.compareTo(finalAmount) >= 0);
    }

    public void addPayment(BigDecimal paymentAmount) {
        if (this.paidAmount == null) this.paidAmount = BigDecimal.ZERO;
        this.paidAmount = this.paidAmount.add(paymentAmount);
        this.paymentDate = LocalDateTime.now();
        updatePaymentStatus();
    }
    
    private void updatePaymentStatus() {
        if (paidAmount == null || paidAmount.compareTo(BigDecimal.ZERO) == 0) {
            this.paymentStatus = PaymentStatus.PENDING;
        } else if (finalAmount != null && paidAmount.compareTo(finalAmount) >= 0) {
            this.paymentStatus = PaymentStatus.PAID;
            this.status = BillStatus.PAID;
        } else {
            this.paymentStatus = PaymentStatus.PARTIALLY_PAID;
        }
    }
    
    public enum BillType {
        CONSULTATION, MEDICATION, PROCEDURE, DIAGNOSTIC, SURGERY, ROOM_CHARGE, NURSING_CARE, 
        LABORATORY, RADIOLOGY, PHYSIOTHERAPY, EMERGENCY, AMBULANCE, FOOD, MISCELLANEOUS
    }
    
    public enum BillStatus {
        DRAFT, PENDING, APPROVED, PAID, PARTIALLY_PAID, CANCELLED, REFUNDED
    }
    
    public enum PaymentStatus {
        PENDING, PARTIALLY_PAID, PAID, OVERDUE, CANCELLED
    }
    
    public enum PaymentMethod {
        CASH, CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER, CHECK, INSURANCE, ONLINE, INSTALLMENT
    }
}
