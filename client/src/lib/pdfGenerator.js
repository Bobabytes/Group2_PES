// lib/pdfGenerator.js
import jsPDF from "jspdf";

export async function generatePayslipPDFFromDB(payslipData) {
  const doc = new jsPDF();
  
  // Your payslip design using database data
  doc.setFontSize(20);
  doc.text("PAYSLIP", 105, 20, { align: "center" });
  
  // Employee details from database
  doc.setFontSize(12);
  doc.text(`Employee: ${payslipData.employeeName || "N/A"}`, 20, 40);
  doc.text(`Employee ID: ${payslipData.employeeId || "N/A"}`, 20, 50);
  doc.text(`Period: ${payslipData.month} ${payslipData.year}`, 20, 60);
  doc.text(`Department: ${payslipData.department || "N/A"}`, 20, 70);
  
  // Salary breakdown from database
  const startY = 90;
  
  // Earnings section
  doc.setFontSize(14);
  doc.text("EARNINGS", 20, startY);
  
  doc.setFontSize(12);
  doc.text("Basic Salary", 20, startY + 10);
  doc.text(`$${(payslipData.basicSalary || 0).toFixed(2)}`, 150, startY + 10);
  
  doc.text("Allowances", 20, startY + 20);
  doc.text(`$${(payslipData.allowances || 0).toFixed(2)}`, 150, startY + 20);
  
  doc.text("Overtime", 20, startY + 30);
  doc.text(`$${(payslipData.overtime || 0).toFixed(2)}`, 150, startY + 30);
  
  // Deductions section
  doc.setFontSize(14);
  doc.text("DEDUCTIONS", 20, startY + 50);
  
  doc.setFontSize(12);
  doc.text("Tax", 20, startY + 60);
  doc.text(`-$${(payslipData.tax || 0).toFixed(2)}`, 150, startY + 60);
  
  doc.text("Insurance", 20, startY + 70);
  doc.text(`-$${(payslipData.insurance || 0).toFixed(2)}`, 150, startY + 70);
  
  doc.text("Other Deductions", 20, startY + 80);
  doc.text(`-$${(payslipData.otherDeductions || 0).toFixed(2)}`, 150, startY + 80);
  
  // Net Salary
  doc.setFontSize(16);
  doc.text("NET SALARY", 20, startY + 100);
  doc.text(`$${(payslipData.netSalary || 0).toFixed(2)}`, 150, startY + 100);
  
  // Footer
  doc.setFontSize(10);
  doc.text("Generated on: " + new Date().toLocaleDateString(), 20, 280);
  doc.text("Confidential Document", 105, 280, { align: "center" });
  
  // Generate blob
  return doc.output("blob");
}