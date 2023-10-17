# HyperLedgerFabric
The capstone project from COMP842 (Applied Blockchains and Cryptocurrencies) at Auckland University of Technology.

# COMP842 

This is a readme file to initalise the COMP842 workspace.

## Table of Contents

- [HyperLedgerFabric](#hyperledgerfabric)
- [COMP842](#comp842)
	- [Table of Contents](#table-of-contents)
	- [Overview](#overview)
	- [Features](#features)
	- [Prerequisite](#prerequisite)
		- [Run a Network and Create a Channel and CA](#run-a-network-and-create-a-channel-and-ca)
		- [Execute a chaincode](#execute-a-chaincode)
		- [Network interaction (Application)](#network-interaction-application)
		- [Clean network](#clean-network)

## Overview

This project aims to understand how a consortium blockchain can be used to securely store and verify qualifications for candidates.

## Features

- User Stories
- Process Mapping
- UI Designs
- Programming foundations

## Prerequisite

 - Git
 - cURL
 - Docker
 - Go


### Run a Network and Create a Channel and CA
Channels are a private layer of communication between specific network members.
Channel is a connection between organizations.

!Execute under `basic-network` folder
- `./network.sh up createChannel -c mychannel -ca`
 default channel name is "myChannel". `-c` option to change 


### Execute a chaincode 
!Execute under `basic-network` folder
- `./network.sh deployCC -ccn basic -ccp ../chaincode/chaincode-typescript/ -ccl typescript`


### Network interaction (Application)
Using peer CLI you can have network interaction such as invoke (update ledgers), channel update/install, create new smart contract

- `cd application`
- `npm install`
- `npm run start`


### Clean network
- `./network.sh down`
