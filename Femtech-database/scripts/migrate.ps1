# D:\SM-WEB\FEMTECH-AFRICA\Femtech-database\scripts\migrate.ps1

param(
    [Parameter(Mandatory=$true)]
    [string]$Host,
    
    [Parameter(Mandatory=$false)]
    [int]$Port = 5432,
    
    [Parameter(Mandatory=$true)]
    [string]$Database,
    
    [Parameter(Mandatory=$true)]
    [string]$Username,
    
    [Parameter(Mandatory=$true)]
    [string]$Password
)

$env:PGPASSWORD = $Password

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Femtech Africa Database Migration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Connecting to: $Host`:$Port/$Database" -ForegroundColor Yellow
Write-Host ""

# Run migrations in order
$migrationsPath = "..\postgres\migrations"
$seedsPath = "..\postgres\seeds"

Write-Host "Running migrations..." -ForegroundColor Green
Write-Host "----------------------------------------"

$migrations = Get-ChildItem -Path $migrationsPath -Filter "*.sql" | Sort-Object Name

foreach ($migration in $migrations) {
    Write-Host "  Running: $($migration.Name)" -ForegroundColor White
    psql -h $Host -p $Port -U $Username -d $Database -f $migration.FullName
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ERROR: Migration failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✓ Complete" -ForegroundColor Green
}

Write-Host ""
Write-Host "Running seed data..." -ForegroundColor Green
Write-Host "----------------------------------------"

$seeds = Get-ChildItem -Path $seedsPath -Filter "*.sql" | Sort-Object Name

foreach ($seed in $seeds) {
    Write-Host "  Running: $($seed.Name)" -ForegroundColor White
    psql -h $Host -p $Port -U $Username -d $Database -f $seed.FullName
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  WARNING: Seed may have partial data" -ForegroundColor Yellow
    } else {
        Write-Host "  ✓ Complete" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Migration Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

# Verify tables
Write-Host ""
Write-Host "Verifying tables..." -ForegroundColor Yellow
psql -h $Host -p $Port -U $Username -d $Database -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"

$env:PGPASSWORD = ""
