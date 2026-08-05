package com.cliniva.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "departments")
public class Department extends BaseEntity {
    
    @Column(name = "department_name", length = 100, nullable = false, unique = true)
    private String departmentName;
    
    @Column(name = "description", length = 500)
    private String description;
    
    @Column(name = "location", length = 100)
    private String location;
    
    @Column(name = "floor_number")
    private Integer floorNumber;
    
    @Column(name = "building", length = 100)
    private String building;
    
    @Column(name = "contact_number", length = 20)
    private String contactNumber;
    
    @Column(name = "email", length = 100)
    private String email;
    
    @Column(name = "head_of_department", length = 100)
    private String headOfDepartment;
    
    @Column(name = "total_beds")
    private Integer totalBeds;
    
    @Column(name = "available_beds")
    private Integer availableBeds;
    
    @Column(name = "services", length = 2000)
    private String services;
    
    @Column(name = "equipment", length = 2000)
    private String equipment;
    
    @Column(name = "doctors_count", nullable = false)
    private Integer doctorsCount = 0;
    
    @Column(name = "nurses_count", nullable = false)
    private Integer nursesCount = 0;
    
    @Column(name = "is_emergency_department", nullable = false)
    private Boolean isEmergencyDepartment = false;
    
    @Column(name = "is_active_department", nullable = false)
    private Boolean isActiveDepartment = true;

    public Department() {}

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Integer getFloorNumber() { return floorNumber; }
    public void setFloorNumber(Integer floorNumber) { this.floorNumber = floorNumber; }
    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getHeadOfDepartment() { return headOfDepartment; }
    public void setHeadOfDepartment(String headOfDepartment) { this.headOfDepartment = headOfDepartment; }
    public Integer getTotalBeds() { return totalBeds; }
    public void setTotalBeds(Integer totalBeds) { this.totalBeds = totalBeds; }
    public Integer getAvailableBeds() { return availableBeds; }
    public void setAvailableBeds(Integer availableBeds) { this.availableBeds = availableBeds; }
    public String getServices() { return services; }
    public void setServices(String services) { this.services = services; }
    public String getEquipment() { return equipment; }
    public void setEquipment(String equipment) { this.equipment = equipment; }
    public Integer getDoctorsCount() { return doctorsCount; }
    public void setDoctorsCount(Integer doctorsCount) { this.doctorsCount = doctorsCount; }
    public Integer getNursesCount() { return nursesCount; }
    public void setNursesCount(Integer nursesCount) { this.nursesCount = nursesCount; }
    public Boolean getIsEmergencyDepartment() { return isEmergencyDepartment; }
    public void setIsEmergencyDepartment(Boolean isEmergencyDepartment) { this.isEmergencyDepartment = isEmergencyDepartment; }
    public Boolean getIsActiveDepartment() { return isActiveDepartment; }
    public void setIsActiveDepartment(Boolean isActiveDepartment) { this.isActiveDepartment = isActiveDepartment; }
    
    public boolean hasAvailableBeds() {
        return availableBeds != null && availableBeds > 0;
    }
    
    public int getOccupiedBeds() {
        if (totalBeds == null || availableBeds == null) return 0;
        return totalBeds - availableBeds;
    }
    
    public double getBedOccupancyRate() {
        if (totalBeds == null || totalBeds == 0) return 0.0;
        return (double) getOccupiedBeds() / totalBeds * 100;
    }
    
    public boolean isOpen() {
        return isActiveDepartment != null && isActiveDepartment;
    }
}
