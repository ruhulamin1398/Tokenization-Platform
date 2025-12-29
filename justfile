# Tokenization Platform POC - Development Recipes
# Run `just --list` to see all available recipes

# Default recipe - show help
default:
    @just --list

# ============================================================================
# CONTRACT TASKS
# ============================================================================

# Install contract dependencies (OpenZeppelin, forge-std, foundry-devops)
contract-install:
    @echo "📦 Installing contract dependencies..."
    cd contract && forge install cyfrin/foundry-devops@0.2.2 && forge install foundry-rs/forge-std@v1.11.0 && forge install OpenZeppelin/openzeppelin-contracts

# Build contracts
contract-build:
    @echo "🔨 Building contracts..."
    cd contract && forge build

# Clean contract build artifacts
contract-clean:
    @echo "🧹 Cleaning contract build artifacts..."
    cd contract && forge clean

# Format contract code
contract-format:
    @echo "✨ Formatting contract code..."
    cd contract && forge fmt

# Lint contracts (format check)
contract-lint:
    @echo "🔍 Linting contracts..."
    cd contract && forge fmt --check

# Run all contract tests with verbose output
contract-test:
    @echo "🧪 Running contract tests..."
    cd contract && forge test -vvv

# Run contract tests with summary
contract-test-summary:
    @echo "🧪 Running contract tests (summary)..."
    cd contract && forge test --summary -vvv

# Run a specific test by name
contract-test-match MATCH:
    @echo "🧪 Running tests matching '{{MATCH}}'..."
    cd contract && forge test --match-test {{MATCH}} -vvvv

# Generate test coverage
contract-coverage:
    @echo "📊 Generating test coverage..."
    cd contract && forge coverage

# Generate coverage report (requires genhtml)
contract-coverage-report:
    @echo "📊 Generating coverage report..."
    cd contract && forge coverage --report lcov && genhtml lcov.info --output-directory coverage-html || echo "⚠️  genhtml not found. Install with: brew install lcov"

# Create test snapshots
contract-snapshot:
    @echo "📸 Creating test snapshots..."
    cd contract && forge snapshot

# Deploy factory contract (requires .env with RPC_URL, PRIVATE_KEY_59, V2_API_KEY)
contract-deploy-factory:
    @echo "🚀 Deploying factory contract..."
    cd contract && forge fmt && forge script script/DeployFactoryContract.s.sol:DeployFactoryContract --rpc-url $${RPC_URL} --private-key $${PRIVATE_KEY_59} --verify --verifier-api-key $${V2_API_KEY} --broadcast -vvvv

# Deploy USDT mock contract (requires .env with RPC_URL, PRIVATE_KEY_59, V2_API_KEY)
contract-deploy-usdt:
    @echo "🚀 Deploying USDT mock contract..."
    cd contract && forge fmt && forge script script/DeployUSDT.s.sol:DeployUSDT --rpc-url $${RPC_URL} --private-key $${PRIVATE_KEY_59} --verify --verifier-api-key $${V2_API_KEY} --broadcast -vvvv

# ============================================================================
# FRONTEND TASKS
# ============================================================================

# Install frontend dependencies
frontend-install:
    @echo "📦 Installing frontend dependencies..."
    cd client && npm install

# Run frontend development server
frontend-dev:
    @echo "🚀 Starting frontend development server..."
    cd client && npm run dev

# Build frontend for production
frontend-build:
    @echo "🔨 Building frontend for production..."
    cd client && npm run build

# Lint frontend code
frontend-lint:
    @echo "🔍 Linting frontend code..."
    cd client && npm run lint

# Preview production build
frontend-preview:
    @echo "👀 Previewing production build..."
    cd client && npm run preview

# ============================================================================
# COMBINED TASKS
# ============================================================================

# Install all dependencies (contracts + frontend)
install-all: contract-install frontend-install
    @echo "✅ All dependencies installed!"

# Build everything (contracts + frontend)
build-all: contract-build frontend-build
    @echo "✅ All builds complete!"

# Run all tests (contracts only for now)
test-all: contract-test
    @echo "✅ All tests complete!"

# Format all code (contracts only)
format-all: contract-format
    @echo "✅ All code formatted!"

# Lint all code (contracts + frontend)
lint-all: contract-lint frontend-lint
    @echo "✅ All linting complete!"

# Clean all build artifacts
clean-all: contract-clean
    @echo "🧹 Cleaning frontend build artifacts..."
    cd client && rm -rf dist node_modules/.vite
    @echo "✅ All clean!"

# ============================================================================
# DEVELOPMENT WORKFLOWS
# ============================================================================

# Setup project from scratch (install dependencies)
setup: install-all
    @echo "📝 Don't forget to:"
    @echo "   1. Copy client/.env.example to client/.env and fill in values"
    @echo "   2. Copy contract/.env.example to contract/.env and fill in values"
    @echo "✅ Setup complete!"

# Run full development workflow (format, lint, test, build)
dev-check: format-all lint-all test-all contract-build
    @echo "✅ Development check complete!"

# Quick development cycle (format, test, build contracts)
dev-quick: contract-format contract-test-summary contract-build
    @echo "✅ Quick dev cycle complete!"

# ============================================================================
# CI/CD TASKS
# ============================================================================

# Run all CI checks (replicates GitHub Actions workflow)
ci-test:
    @echo "🚀 Running CI checks (matching GitHub Actions workflow)..."
    @echo ""
    @echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    @echo "📋 CONTRACT CHECKS"
    @echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    @echo ""
    @echo "1️⃣  Format check..."
    @cd contract && forge fmt --check || (echo "❌ Format check failed. Run 'just contract-format' to fix." && exit 1)
    @echo "✅ Format check passed"
    @echo ""
    @echo "2️⃣  Building contracts..."
    @cd contract && forge build || (echo "❌ Contract build failed" && exit 1)
    @echo "✅ Contracts built successfully"
    @echo ""
    @echo "3️⃣  Running tests..."
    @cd contract && forge test --summary || (echo "❌ Tests failed" && exit 1)
    @echo "✅ All tests passed"
    @echo ""
    @echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    @echo "📋 FRONTEND CHECKS"
    @echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    @echo ""
    @echo "4️⃣  Linting frontend..."
    @cd client && npm run lint || (echo "❌ Frontend lint failed" && exit 1)
    @echo "✅ Frontend lint passed"
    @echo ""
    @echo "5️⃣  Building frontend..."
    @cd client && npm run build || (echo "❌ Frontend build failed" && exit 1)
    @echo "✅ Frontend built successfully"
    @echo ""
    @echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    @echo "✅ All CI checks passed!"
    @echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ============================================================================
# UTILITY TASKS
# ============================================================================

# Show project structure
tree:
    @echo "📁 Project structure:"
    @tree -L 2 -I 'node_modules|lib|out|dist|coverage-html|.git' || find . -maxdepth 2 -not -path '*/\.*' -not -path '*/node_modules/*' -not -path '*/lib/*' -not -path '*/out/*' -not -path '*/dist/*' | head -20

# Check if required tools are installed
check-tools:
    @echo "🔧 Checking required tools..."
    @command -v forge >/dev/null 2>&1 && echo "✅ Foundry installed" || echo "❌ Foundry not found - install at https://book.getfoundry.sh/getting-started/installation"
    @command -v node >/dev/null 2>&1 && echo "✅ Node.js installed" || echo "❌ Node.js not found - install at https://nodejs.org/"
    @command -v npm >/dev/null 2>&1 && echo "✅ npm installed" || echo "❌ npm not found"
    @command -v just >/dev/null 2>&1 && echo "✅ Just installed" || echo "❌ Just not found - install with: cargo install just"

# Show environment status
env-status:
    @echo "🔐 Environment status:"
    @test -f contract/.env && echo "✅ contract/.env exists" || echo "❌ contract/.env missing"
    @test -f client/.env && echo "✅ client/.env exists" || echo "❌ client/.env missing"
    @test -f client/.env.example && echo "✅ client/.env.example exists" || echo "❌ client/.env.example missing"

# ============================================================================
# HELPERS
# ============================================================================

# Show this help message
help:
    @echo "Tokenization Platform POC - Development Recipes"
    @echo ""
    @echo "CONTRACT TASKS:"
    @echo "  just contract-install          Install contract dependencies"
    @echo "  just contract-build            Build contracts"
    @echo "  just contract-test             Run all contract tests"
    @echo "  just contract-test-match NAME   Run specific test"
    @echo "  just contract-format           Format contract code"
    @echo "  just contract-lint             Lint contracts"
    @echo "  just contract-coverage         Generate coverage"
    @echo ""
    @echo "FRONTEND TASKS:"
    @echo "  just frontend-install          Install frontend dependencies"
    @echo "  just frontend-dev               Start dev server"
    @echo "  just frontend-build            Build for production"
    @echo "  just frontend-lint             Lint frontend code"
    @echo ""
    @echo "COMBINED TASKS:"
    @echo "  just install-all               Install all dependencies"
    @echo "  just build-all                 Build everything"
    @echo "  just test-all                  Run all tests"
    @echo "  just lint-all                  Lint everything"
    @echo "  just clean-all                 Clean all artifacts"
    @echo ""
    @echo "CI/CD TASKS:"
    @echo "  just ci-test                  Run all CI checks (matches GitHub Actions)"
    @echo ""
    @echo "UTILITIES:"
    @echo "  just setup                     Initial project setup"
    @echo "  just check-tools               Check if tools are installed"
    @echo "  just env-status                Check environment files"
    @echo ""
    @echo "Run 'just --list' to see all available recipes"

