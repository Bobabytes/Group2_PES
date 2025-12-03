// lib/pdfGenerator.js
import jsPDF from "jspdf";

export async function generatePayslipPDF(payslip, userData) {
  // Create PDF document
  const doc = new jsPDF();
  
  // Company Header
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102); // Dark blue
  doc.text("COMPANY PAYSLIP", 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("123 Business Street, City, Country", 105, 30, { align: "center" });
  doc.text("Tel: (123) 456-7890 | Email: payroll@company.com", 105, 36, { align: "center" });
  
  // Employee Information
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Employee: ${userData.username}`, 20, 55);
  doc.text(`Employee ID: ${userData.username.toUpperCase().replace('_', '')}`, 20, 62);
  doc.text(`Position: ${userData.position}`, 20, 69);
  
  // Payslip Period
  doc.text(`Period: ${payslip.month} ${payslip.year}`, 130, 55);
  doc.text(`Payment Date: ${new Date().toLocaleDateString()}`, 130, 62);
  doc.text(`Status: ${payslip.status}`, 130, 69);
  
  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 75, 190, 75);
  
  // Earnings Section
  doc.setFontSize(14);
  doc.setTextColor(0, 102, 0); // Green
  doc.text("EARNINGS", 20, 85);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  // Basic Salary
  doc.text("Basic Salary", 30, 95);
  doc.text(`$${payslip.amount.toFixed(2)}`, 160, 95, { align: "right" });
  
  // Allowances
  const housingAllowance = payslip.amount * 0.10;
  const transportAllowance = 200.00;
  const mealAllowance = 150.00;
  
  doc.text("Housing Allowance", 30, 105);
  doc.text(`$${housingAllowance.toFixed(2)}`, 160, 105, { align: "right" });
  
  doc.text("Transport Allowance", 30, 115);
  doc.text(`$${transportAllowance.toFixed(2)}`, 160, 115, { align: "right" });
  
  doc.text("Meal Allowance", 30, 125);
  doc.text(`$${mealAllowance.toFixed(2)}`, 160, 125, { align: "right" });
  
  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 135, 190, 135);
  
  // Deductions Section
  doc.setFontSize(14);
  doc.setTextColor(204, 0, 0); // Red
  doc.text("DEDUCTIONS", 20, 145);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  // Deductions
  const tax = payslip.amount * 0.15;
  const insurance = 120.00;
  const pension = payslip.amount * 0.05;
  
  doc.text("Income Tax", 30, 155);
  doc.text(`-$${tax.toFixed(2)}`, 160, 155, { align: "right" });
  
  doc.text("Health Insurance", 30, 165);
  doc.text(`-$${insurance.toFixed(2)}`, 160, 165, { align: "right" });
  
  doc.text("Pension Contribution", 30, 175);
  doc.text(`-$${pension.toFixed(2)}`, 160, 175, { align: "right" });
  
  // Line separator
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(20, 185, 190, 185);
  
  // Total Calculations
  const totalEarnings = payslip.amount + housingAllowance + transportAllowance + mealAllowance;
  const totalDeductions = tax + insurance + pension;
  const netPay = totalEarnings - totalDeductions;
  
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.text("TOTAL EARNINGS", 30, 195);
  doc.text(`$${totalEarnings.toFixed(2)}`, 160, 195, { align: "right" });
  
  doc.text("TOTAL DEDUCTIONS", 30, 205);
  doc.text(`-$${totalDeductions.toFixed(2)}`, 160, 205, { align: "right" });
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'bold');
  doc.text("NET PAY", 30, 220);
  doc.text(`$${netPay.toFixed(2)}`, 160, 220, { align: "right" });
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'normal');
  doc.text("This is a computer-generated document. No signature required.", 105, 250, { align: "center" });
  doc.text("Confidential - For employee use only", 105, 256, { align: "center" });
  doc.text(`Payslip ID: ${payslip.id} | Generated: ${new Date().toLocaleString()}`, 105, 262, { align: "center" });
  
  // Generate PDF as blob
  const pdfBlob = doc.output("blob");
  const url = URL.createObjectURL(pdfBlob);
  
  return url;
}