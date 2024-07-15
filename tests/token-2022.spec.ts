import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Token2022 } from '../target/types/token_2022';

describe("Test Token-2022", () => {
       const provider = anchor.AnchorProvider.env();
       anchor.setProvider(provider);

       const program = anchor.workspace.Token2022 as Program<Token2022>;
       const connection = program.provider.connection;
       const wallet = provider.wallet as anchor.Wallet;

       const TOKEN_2022_PROGRAM_ID = new anchor.web3.PublicKey(
              "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
       );
       const ATA_PROGRAM_ID = new anchor.web3.PublicKey(
              "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
       );

       const tokenName = "TestToken Suan";
       const receiver = anchor.web3.Keypair.generate();

       const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
              [
                     Buffer.from("token-2022-token"),
                     wallet.publicKey.toBytes(),
                     Buffer.from(tokenName),
              ],
              program.programId
       );

       const [payerATA] = anchor.web3.PublicKey.findProgramAddressSync(
              [
                     wallet.publicKey.toBytes(),
                     TOKEN_2022_PROGRAM_ID.toBytes(),
                     mint.toBytes(),
              ],
              ATA_PROGRAM_ID
       );
       const [receiverATA] = anchor.web3.PublicKey.findProgramAddressSync(
              [
                     receiver.publicKey.toBytes(),
                     TOKEN_2022_PROGRAM_ID.toBytes(),
                     mint.toBytes(),
              ],
              ATA_PROGRAM_ID
       );

       
       it("Create Token-2022 Token", async() => {
              console.log("<---------- Create Token-2022 Token Test ---------->")
              await connection.requestAirdrop(receiver.publicKey, 1000000000);
              await connection.requestAirdrop(wallet.publicKey, 1000000000);

              const tx = new anchor.web3.Transaction();
              const ix = await program.methods
                     .createToken(tokenName)
                     .accounts({
                            signer: wallet.publicKey,
                            tokenProgram: TOKEN_2022_PROGRAM_ID
                     })
                     .instruction()

              tx.add(ix);

              const txHash = await anchor.web3.sendAndConfirmTransaction(
                     program.provider.connection,
                     tx,
                     [wallet.payer]
              );

              console.log("Success! Tx Hash: ", txHash);
       })


       it("Initialize payer ATA", async () => {
              console.log("<---------- Initialize payer ATA Test ---------->")

              const tx = new anchor.web3.Transaction();
              const ix = await program.methods
                     .createAssociatedTokenAccount()
                     .accounts({
                            tokenAccount: payerATA,
                            mint: mint,
                            signer: wallet.publicKey,
                            tokenProgram: TOKEN_2022_PROGRAM_ID
                     })
                     .instruction();
          
              tx.add(ix);
          
              const txHash = await anchor.web3.sendAndConfirmTransaction(
                     program.provider.connection,
                     tx,
                     [wallet.payer]
              );

              console.log("Success! Tx Hash: ", txHash);
       });


       it("Mint Token to payer", async () => {
              console.log("<---------- Mint Token-2022 to payer Test ---------->")
              const tx = new anchor.web3.Transaction();
          
              const ix = await program.methods
                     .mintToken(new anchor.BN(200000000))
                     .accounts({
                            mint: mint,
                            signer: wallet.publicKey,
                            receiver: payerATA,
                            tokenProgram: TOKEN_2022_PROGRAM_ID,
                     })
                     .instruction();
          
              tx.add(ix);
          
              const sig = await anchor.web3.sendAndConfirmTransaction(
                program.provider.connection,
                tx,
                [wallet.payer]
              );
              console.log("Success! Tx Hash: ", sig);
       });


       it("Transfer Token", async () => {
              console.log("<---------- Transfer Token-2022 Test ---------->")
              const tx = new anchor.web3.Transaction();
          
              const ix = await program.methods
                     .transferToken(new anchor.BN(100))
                     .accounts({
                            mint: mint,
                            signer: wallet.publicKey,
                            from: payerATA,
                            to: receiver.publicKey,
                            tokenProgram: TOKEN_2022_PROGRAM_ID,
                            toAta: receiverATA
                     })
                     .instruction();
          
              tx.add(ix);
          
              const sig = await anchor.web3.sendAndConfirmTransaction(
                     program.provider.connection,
                     tx,
                     [wallet.payer]
              );

              console.log("Success! Tx Hash: ", sig);
              
       });
       
})
