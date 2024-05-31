#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

pub mod instructions;
use instructions::*;

declare_id!("Ee9SLwPPbxU2JtmHP95iczpbLASFwsQfrfoEvJ3P73iS");

#[program]
pub mod token_minter {
    use super::*;

    pub fn create_token(ctx: Context<CreateToken>, _token_decimals: u8, token_name: String, token_symbol: String, token_uri: String) -> Result<()> {
        create::create_token(ctx, _token_decimals, token_name, token_symbol, token_uri)
    }


    pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {
        mint::mint_token(ctx, amount)
    }


    pub fn pda_create_token(ctx: Context<PdaCreateToken>, token_name: String, token_symbol: String, token_uri: String) -> Result<()> {
        pda_create::pda_create_token(ctx, token_name, token_symbol, token_uri)
    }

    pub fn pda_mint_token(ctx: Context<PdaMintToken>, amount: u64) -> Result<()> {
        pda_mint::pda_mint_token(ctx, amount)
    }
}


