#!/bin/bash

./basic-network/network.sh up createChannel -c mychannel -ca

./basic-network/network.sh deployCC -ccn basic -ccp ../chaincode/chaincode-typescript/ -ccl typescript

