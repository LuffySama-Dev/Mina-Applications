import { Cvv } from './Cvv.js';
import { Field, Mina, PrivateKey, AccountUpdate } from 'snarkyjs';

console.log(`Snarky is Loaded !!!`);

const useProof = false;

const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);

const { privateKey: deployerKey, publicKey: deployerAccount } =
  Local.testAccounts[0];
const { privateKey: senderKey, publicKey: senderAccount } =
  Local.testAccounts[1];

// For now we are setting a temp keyword.
// In realtime it will be taken by user
const keyword = 123456;
const cvv = 123;

const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

const zkAppInstance = new Cvv(zkAppAddress);
const deployTxn = await Mina.transaction(deployerAccount, () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  zkAppInstance.deploy();
  zkAppInstance.initCvvHash(Field(keyword), Field(cvv));
});

await deployTxn.prove();
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

const num0 = zkAppInstance.cvvHash.get();
console.log(`The cvvhash is ${num0} .`);

const txn1 = await Mina.transaction(senderAccount, () => {
  zkAppInstance.makeTxn(Field(keyword), Field(cvv));
});
await txn1.prove();
await txn1.sign([senderKey]).send();

const num1 = zkAppInstance.cvvHash.get();
console.log(
  `Your transaction is success as existing hash ${num0} is equal to ${num1} .`
);

console.log(`Snarky Unloaded !!`);
