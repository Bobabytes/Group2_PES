@echo off
echo 🚀 Testing PDF Viewer Environment
echo.

set BASE_URL=http://localhost:5173

echo Checking if React app is running...
powershell -Command "try { Invoke-WebRequest -Uri '%BASE_URL%' -Method Head -TimeoutSec 5; echo '✓ React app is running' } catch { echo '✗ React app not found'; echo 'Run: npm run dev'; exit 1 }"

echo.
echo Checking PDF files...

powershell -Command "try { Invoke-WebRequest -Uri '%BASE_URL%/payslips/sample-payslip-1.pdf' -Method Head -TimeoutSec 5; echo '✓ sample-payslip-1.pdf is available' } catch { echo '✗ sample-payslip-1.pdf is missing' }"

powershell -Command "try { Invoke-WebRequest -Uri '%BASE_URL%/payslips/sample-payslip-2.pdf' -Method Head -TimeoutSec 5; echo '✓ sample-payslip-2.pdf is available' } catch { echo '✗ sample-payslip-2.pdf is missing' }"

echo.
echo ✅ Test complete! Open your browser and test the PDF viewer manually.
pause