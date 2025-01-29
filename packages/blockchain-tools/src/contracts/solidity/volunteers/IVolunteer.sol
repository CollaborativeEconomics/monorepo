// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

interface IVolunteer {
    function whitelistAddresses(address[] memory _addresses) external;
    function removeFromWhitelist(address _address) external;
    function distributeTokens() external;
    function getTokens() external view returns (address[] memory _tokens);
    function getWhitelistedAddresses() external view returns (address[] memory whitelist);
    function isWhitelisted(address user) external view returns (bool status);
    function updateWhitelist(address user) external;
}
