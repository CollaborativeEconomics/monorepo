// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {ERC1155TokenGatedDistributor} from "./ERC1155TokenGatedDistributor.sol";
import {Owned} from "lib/solmate/src/auth/Owned.sol";

/**
 * @title ERC1155TokenGatedDistributorFactory
 * @dev Factory contract for deploying ERC1155TokenGatedDistributor instances
 */
contract ERC1155TokenGatedDistributorFactory is Owned {
    // Track all deployed distributors
    address[] public deployedDistributors;
    
    // Mapping to check if an address is a distributor created by this factory
    mapping(address => bool) public isDistributor;
    mapping(address => address) public distributorByOwner;
    
    // Events
    event DistributorDeployed(
        address indexed distributorAddress,
        address indexed owner,
        address indexed rewardToken,
        uint256 baseFee,
        string uri
    );

    constructor() Owned(msg.sender) {}

    /**
     * @dev Deploy a new ERC1155TokenGatedDistributor contract
     * @param uri Base URI for token metadata
     * @param distributorOwner Owner of the new distributor
     * @param rewardToken Address of the ERC20 token used for rewards
     * @param baseFee Base fee for reward calculations
     * @return The address of the newly deployed distributor
     */
    function deployDistributor(
        string memory uri,
        address distributorOwner,
        address rewardToken,
        uint256 baseFee
    ) external returns (address) {
        require(distributorOwner != address(0), "Invalid owner address");
        
        ERC1155TokenGatedDistributor distributor = new ERC1155TokenGatedDistributor(
            uri,
            distributorOwner,
            rewardToken,
            baseFee
        );
        
        address distributorAddress = address(distributor);
        deployedDistributors.push(distributorAddress);
        isDistributor[distributorAddress] = true;
        distributorByOwner[distributorOwner] = distributorAddress;
        emit DistributorDeployed(
            distributorAddress,
            distributorOwner,
            rewardToken,
            baseFee,
            uri
        );
        
        return distributorAddress;
    }
    
    /**
     * @dev Get the total number of deployed distributors
     * @return The count of deployed distributors
     */
    function getDistributorCount() external view returns (uint256) {
        return deployedDistributors.length;
    }
    
    /**
     * @dev Get all deployed distributors
     * @return Array of distributor addresses
     */
    function getAllDistributors() external view returns (address[] memory) {
        return deployedDistributors;
    }
    
    /**
     * @dev Get distributor address by owner address
     * @param owner Address of the owner
     * @return The distributor address
     */
    function getDistributorByOwner(address owner) external view returns (address) {
        return distributorByOwner[owner];
    }
    
    /**
     * @dev Get distributors with pagination
     * @param startIndex Starting index for pagination
     * @param count Number of distributors to return
     * @return Array of distributor addresses for the requested page
     */
    function getDistributorsPaginated(uint256 startIndex, uint256 count) 
        external 
        view 
        returns (address[] memory) 
    {
        require(startIndex < deployedDistributors.length, "Start index out of bounds");
        
        // Adjust count if it exceeds array bounds
        if (startIndex + count > deployedDistributors.length) {
            count = deployedDistributors.length - startIndex;
        }
        
        address[] memory result = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = deployedDistributors[startIndex + i];
        }
        
        return result;
    }
    
    /**
     * @dev Get distributors owned by a specific address
     * @param owner Address of the owner
     * @return Array of distributor addresses owned by the specified address
     */
    function getDistributorsByOwner(address owner) external view returns (address[] memory) {
        // First count how many distributors are owned by this address
        uint256 count = 0;
        for (uint256 i = 0; i < deployedDistributors.length; i++) {
            // Use a safer way to call the owner() function
            address distributorOwner;
            // Call the owner() function directly without casting
            (bool success, bytes memory data) = deployedDistributors[i].staticcall(
                abi.encodeWithSignature("owner()")
            );
            if (success && data.length == 32) {
                distributorOwner = abi.decode(data, (address));
                if (distributorOwner == owner) {
                    count++;
                }
            }
        }
        
        // Create and populate the result array
        address[] memory result = new address[](count);
        uint256 resultIndex = 0;
        
        for (uint256 i = 0; i < deployedDistributors.length; i++) {
            // Use the same safer approach
            address distributorOwner;
            (bool success, bytes memory data) = deployedDistributors[i].staticcall(
                abi.encodeWithSignature("owner()")
            );
            if (success && data.length == 32) {
                distributorOwner = abi.decode(data, (address));
                if (distributorOwner == owner) {
                    result[resultIndex] = deployedDistributors[i];
                    resultIndex++;
                }
            }
        }
        
        return result;
    }
    
    /**
     * @dev Verify if a contract was deployed by this factory
     * @param distributorAddress Address to check
     * @return True if the address is a distributor deployed by this factory
     */
    function verifyDistributor(address distributorAddress) external view returns (bool) {
        return isDistributor[distributorAddress];
    }
} 