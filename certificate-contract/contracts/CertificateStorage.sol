// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateStorage {

    // certificateKey → hash
    mapping(string => string) private certificateHashes;

    event CertificateStored(string certificateKey, string hash, uint256 timestamp);

    // Store hash for a specific certificate
    function storeCertificateHash(string memory certificateKey, string memory hash) public {
        certificateHashes[certificateKey] = hash;
        emit CertificateStored(certificateKey, hash, block.timestamp);
    }

    // Retrieve hash
    function getCertificateHash(string memory certificateKey) public view returns (string memory) {
        return certificateHashes[certificateKey];
    }
}
