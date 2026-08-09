package com.cliniva.repository;

import com.cliniva.entity.Bill;
import com.cliniva.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    
    List<Bill> findByPatient(User patient);
    
    List<Bill> findByBillType(Bill.BillType billType);
    
    List<Bill> findByStatus(Bill.BillStatus status);
    
    List<Bill> findByPaymentStatus(Bill.PaymentStatus paymentStatus);
    
    @Query("SELECT b FROM Bill b WHERE b.patient.id = :patientId ORDER BY b.billDate DESC")
    Page<Bill> findBillsByPatientId(@Param("patientId") Long patientId, Pageable pageable);
    
    @Query("SELECT b FROM Bill b WHERE b.patient.id = :patientId AND b.paymentStatus = :paymentStatus ORDER BY b.billDate DESC")
    List<Bill> findBillsByPatientAndStatus(@Param("patientId") Long patientId, @Param("paymentStatus") Bill.PaymentStatus paymentStatus);
    
    @Query("SELECT b FROM Bill b WHERE b.dueDate < :date AND b.paymentStatus != 'PAID'")
    List<Bill> findOverdueBills(@Param("date") LocalDate date);
    
    @Query("SELECT SUM(b.finalAmount) FROM Bill b WHERE b.patient.id = :patientId AND b.paymentStatus != 'PAID'")
    BigDecimal getTotalOutstandingAmount(@Param("patientId") Long patientId);
    
    @Query("SELECT SUM(b.finalAmount) FROM Bill b WHERE b.billDate >= :startDate AND b.billDate <= :endDate")
    BigDecimal getTotalBillsInPeriod(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(b.paidAmount) FROM Bill b WHERE b.paymentDate >= :startDate AND b.paymentDate <= :endDate")
    BigDecimal getTotalCollectionsInPeriod(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT b FROM Bill b WHERE (LOWER(b.itemName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(b.itemDescription) LIKE LOWER(CONCAT('%', :search, '%'))) AND b.patient.id = :patientId")
    Page<Bill> searchBills(@Param("patientId") Long patientId, @Param("search") String search, Pageable pageable);
    
    @Query("SELECT b FROM Bill b WHERE b.isInsuranceCovered = true AND b.paymentStatus = 'PENDING'")
    List<Bill> findPendingInsuranceBills();
}
