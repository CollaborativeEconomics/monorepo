// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

interface IVolunteer {
    function distributeTokensByUnit(address[] memory _recipients) external;
    function withdrawToken() external;
    function updateBaseFee(uint256 _baseFee) external;
    function changeTokenAddress(address _tokenAddress) external;
    function getBaseFee() external view returns (uint256 _baseFee);
    function getToken() external view returns (address);
    function getNFTAddress() external view returns (address _nftContract);
}
