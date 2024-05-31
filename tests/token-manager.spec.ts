import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import * as spl from '@solana/spl-token';
import {TokenManager} from "../target/types/token_manager";
import { TIMEOUT } from "dns";
import { equal } from "assert";
// import {assert} from "chai";


describe("Test Token Manager", () => {
       const provider = anchor.AnchorProvider.env();
       anchor.setProvider(provider);
       
       const connection = provider.connection;
       const program = anchor.workspace.TokenManager as anchor.Program<TokenManager>;

       // Metaplex Constants
       const METADATA_SEED = "metadata";
       const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
       
       // Constants from our program
       const MINT_SEED = "mint";
       
       // Data for our tests
       // const payer = pg.wallet.publicKey;
       const payer = provider.wallet as anchor.Wallet;
       
       const metadata = {
              name: "Just a Test Token",
              symbol: "Suan TEST",
              uri: "https://5vfxc4tr6xoy23qefqbj4qx2adzkzapneebanhcalf7myvn5gzja.arweave.net/7UtxcnH13Y1uBCwCnkL6APKsge0hAgacQFl-zFW9NlI",
              decimals: 9,
       };
       const mintAmount = 10;

       const [MintPDA] = PublicKey.findProgramAddressSync(
              [Buffer.from(MINT_SEED)],
              program.programId
       );
   
       const [metadataAddress] = PublicKey.findProgramAddressSync(
              [
                     Buffer.from(METADATA_SEED),
                     TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                     MintPDA.toBuffer(),
              ],
              TOKEN_METADATA_PROGRAM_ID
       );
     
       // Test init token
       it("initialize token", async () => {

              const info = await connection.getAccountInfo(MintPDA);
              if (info) {
                return; // Do not attempt to initialize if already initialized
              }
              console.log("  Mint not found. Attempting to initialize.");

              program.programId
              provider.wallet.publicKey
           
              const context = {
                     metadata: metadataAddress,
                     MintPDA,
                     payer: payer.publicKey,
                     rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                     systemProgram: anchor.web3.SystemProgram.programId,
                     tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
                     tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
              };
          
              const txHash = await program.methods
                .initToken(metadata)
                .accounts(context)
                .rpc();
          
              await connection.confirmTransaction(txHash, 'finalized');
              console.log(`  https://explorer.solana.com/tx/${txHash}?cluster=devnet`);
              const newInfo = await connection.getAccountInfo(MintPDA);
              // assert(newInfo, "  Mint should be initialized.");
       }, 10000);
     
       // Test mint tokens
       it("mint tokens", async () => {
              console.log("<-------------- Minting tokens test -------------->")

              const destination = await anchor.utils.token.associatedAddress({
                     mint: MintPDA,
                     owner: payer.publicKey,
              });

              console.log(`  destination: ${destination}`)
          
              let initialBalance: number;
              try {
                     const balance = (await connection.getTokenAccountBalance(destination))
                     initialBalance = balance.value.uiAmount!;
              } catch {
                     // Token account not yet initiated has 0 balance
                     initialBalance = 0;
              } 
              
              const amount = new anchor.BN(mintAmount * 10 ** metadata.decimals)
              const context = {
                     MintPDA,
                     destination,
                     payer: payer.publicKey,
                     rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                     systemProgram: anchor.web3.SystemProgram.programId,
                     tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
                     associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
              };
          
              const txHash = await program.methods
                .mintTokens(amount)
                .accounts(context)
                .rpc();
              await connection.confirmTransaction(txHash);
              console.log(`  https://explorer.solana.com/tx/${txHash}?cluster=devnet`);
              
              const postBalance = (
                     await connection.getTokenAccountBalance(destination)
              ).value.uiAmount;

              console.log(`  initialBalance: ${initialBalance}; mintAmount: ${mintAmount}; postBalance: ${postBalance}`)
              
              equal(initialBalance + mintAmount, postBalance, "Post balance should equal initial plus mint amount")
              
       });
   
});