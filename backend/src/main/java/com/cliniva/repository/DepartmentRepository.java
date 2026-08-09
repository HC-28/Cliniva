package com.cliniva.repository;

import com.cliniva.entity.Department;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    
    List<Department> findByIsActiveDepartment(Boolean isActive);
    
    List<Department> findByIsEmergencyDepartment(Boolean isEmergency);
    
    @Query("SELECT d FROM Department d WHERE d.isActiveDepartment = true ORDER BY d.departmentName")
    List<Department> findAllActiveDepartments();
    
    @Query("SELECT d FROM Department d WHERE (LOWER(d.departmentName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND d.isActiveDepartment = true")
    Page<Department> searchDepartments(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT d FROM Department d WHERE d.isEmergencyDepartment = true AND d.isActiveDepartment = true")
    List<Department> findEmergencyDepartments();
    
    @Query("SELECT d FROM Department d WHERE d.availableBeds > 0 AND d.isActiveDepartment = true")
    List<Department> findDepartmentsWithAvailableBeds();
}
