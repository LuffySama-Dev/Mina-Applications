import { Field, SmartContract, state, State, method, Poseidon } from 'snarkyjs';

export class Cvv extends SmartContract {
  @state(Field) cvvHash = State<Field>();

  @method initCvvHash(keyword: Field, cvv: Field) {
    // Create a hash with keyword and cvv and set the cvv hash
    this.cvvHash.set(Poseidon.hash([keyword, cvv]));
  }

  @method makeTxn(keyword: Field, cvv: Field) {
    const x = this.cvvHash.get();
    this.cvvHash.assertEquals(x);

    // If the hash matches with the existing one then only proceed with txn
    Poseidon.hash([keyword, cvv]).assertEquals(x);
  }
}
