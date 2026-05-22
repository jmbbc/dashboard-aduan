$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
try {
    $workbook = $excel.Workbooks.Open("H:\Building Maintenance\5) BC Technical\9) Checklist PPM Banjaria Court\Checklist PPM Banjaria Court.xlsx", 0, $true)
    $sheet = $workbook.Sheets.Item("ELEKT - SWIMMING WATER PUMP")
    $range = $sheet.UsedRange
    $rows = $range.Rows.Count
    $cols = $range.Columns.Count
    for ($r = 1; $r -le $rows; $r++) {
        $rowData = @()
        for ($c = 1; $c -le $cols; $c++) {
            $rowData += $range.Cells.Item($r, $c).Text
        }
        Write-Output ("ROW_$r`: " + ($rowData -join " | "))
    }
} finally {
    if ($workbook) { $workbook.Close($false) }
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
