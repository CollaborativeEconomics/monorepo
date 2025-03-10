// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

interface IVolunteer {
    function whitelistAddresses(address[] memory _addresses) external;
    function removeFromWhitelist(address _address) external;
    // function distributeTokensEqually(uint256 tokenId) external;
    function distributeTokensByUnit(address[] memory recipients) external;
    function withdrawToken() external;
    function updateBaseFee(uint256 _baseFee) external;
    function getBaseFee() external view returns (uint256 _baseFee);
    function getToken() external view returns (address _token);
    function getWhitelistedAddresses() external view returns (address[] memory whitelist);
    function isWhitelisted(address user) external view returns (bool status);
    function updateWhitelist(address user) external;
}
