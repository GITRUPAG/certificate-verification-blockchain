package com.verification.certificateVerification.service;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.RawTransaction;
import org.web3j.crypto.TransactionEncoder;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.protocol.core.methods.response.EthGetTransactionCount;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.tx.gas.DefaultGasProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BlockchainService {

    private final Web3j web3j;
    private final Credentials credentials;

    @Value("${web3.contract.address}")
    private String contractAddress;

    /**
     * ✅ Store certificate hash on blockchain with a UNIQUE KEY
     * certificateKey = studentId + "-" + certificateName
     */
    public String storeHash(String certificateKey, String hash) throws Exception {

        Function function = new Function(
                "storeCertificateHash",
                Arrays.asList(new Utf8String(certificateKey), new Utf8String(hash)),
                Collections.emptyList()
        );

        String encoded = FunctionEncoder.encode(function);

        EthGetTransactionCount txCount = web3j.ethGetTransactionCount(
                credentials.getAddress(),
                DefaultBlockParameter.valueOf("latest")
        ).send();

        BigInteger nonce = txCount.getTransactionCount();

        RawTransaction rawTransaction = RawTransaction.createTransaction(
                nonce,
                DefaultGasProvider.GAS_PRICE,
                DefaultGasProvider.GAS_LIMIT,
                contractAddress,
                encoded
        );

        byte[] signedMessage = TransactionEncoder.signMessage(rawTransaction, credentials);
        String hexValue = bytesToHex(signedMessage);

        EthSendTransaction result = web3j.ethSendRawTransaction(hexValue).send();

        if (result.getError() != null) {
            throw new RuntimeException("Blockchain Error → " + result.getError().getMessage());
        }

        return result.getTransactionHash();
    }

    /**
     * ✅ Read stored hash using UNIQUE certificateKey
     */
    public String getHash(String certificateKey) throws Exception {

        Function function = new Function(
                "getCertificateHash",
                Arrays.asList(new Utf8String(certificateKey)),
                Arrays.asList(new TypeReference<Utf8String>() {})
        );

        String encoded = FunctionEncoder.encode(function);

        EthCall response = web3j.ethCall(
                Transaction.createEthCallTransaction(
                        credentials.getAddress(),
                        contractAddress,
                        encoded
                ),
                DefaultBlockParameter.valueOf("latest")
        ).send();

        List<Type> decoded =
                FunctionReturnDecoder.decode(response.getValue(), function.getOutputParameters());

        if (decoded.isEmpty()) return null;

        return decoded.get(0).getValue().toString();
    }

    // ✅ Utility
    private static String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) result.append(String.format("%02x", b));
        return "0x" + result.toString();
    }
}
