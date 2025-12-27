-include .env
 
install:; forge install cyfrin/foundry-devops@0.2.2 && forge install foundry-rs/forge-std@v1.11.0 && forge install OpenZeppelin/openzeppelin-contracts 

build:; forge clean &&  forge build     

test-all :; forge fmt &&   forge test   -vvv
test-summary :; forge fmt &&   forge test --summary  -vvv
mt t= :;   forge test --mt $(t) -vvvv

coverage :;   forge coverage 
coverage-report :;   forge coverage   --report lcov && genhtml lcov.info --output-directory coverage-html

snapshot :; forge snapshot

format :; forge fmt
lint :; forge fmt --check && forge verify --check



# ALL
deploy :; forge fmt && forge script script/DeployFactoryContract.s.sol:DeployFactoryContract --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY_59) --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv
# ALL
deploy-usdt :; forge fmt && forge script script/DeployUSDT.s.sol:DeployUSDT --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY_59) --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv 

