# HyperLedgerFabric
Captone project from Blockchain paper

# COMP842 

This is a readme file to initalise the COMP842 workspace.

## Table of Contents

- [HyperLedgerFabric](#hyperledgerfabric)
- [COMP842](#comp842)
	- [Table of Contents](#table-of-contents)
	- [Overview](#overview)
	- [Features](#features)
	- [Prerequisite](#prerequisite)
	- [Procedure](#procedure)
		- [Run a Network](#run-a-network)
		- [Create a Channel](#create-a-channel)
		- [Execute a chaincode](#execute-a-chaincode)
		- [Network interaction](#network-interaction)

## Overview

This project aims to understand how blockchain can be used to securely store and verify qualifications for candididates.

## Features

- Literature Review
- User Stories
- UI Designs
- Programming foundations


## Prerequisite

 - Git
 - cURL
 - Docker
 - Go


## Procedure

- install fabric-samples by `./install-fabric.sh d s b ` 

### Run a Network
- `cd fabric-samples/test-network`
- Run test network on docker by `./network up`

  ```test network is composed of 2 peers, 1 orderer, 1 client```
- you can check number of containers(4) by `docker ps -a`


### Create a Channel
Channels are a private layer of communication between specific network members.
Channel is a connection between organizations.

- `./network.sh createChannel`
 default channel name is "myChannel". `-c` option to change 


### Execute a chaincode 
- `./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go`


### Network interaction
Using peer CLI you can have network interaction such as invoke (update ledgers), channel update/install, create new smart contract

Will update this later