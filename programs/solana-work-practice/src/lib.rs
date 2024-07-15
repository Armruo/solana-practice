use anchor_lang::prelude::*;

declare_id!("6gP86XwGHXuRU1yNdBWnwd9unPNuQjy3Sr7T3oe7aQbW");

#[program]
pub mod solana_work_practice {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {

        msg!("This program's ProgramID is: {}", &id());
        

        Ok(())
    }

    pub fn say_hello(_ctx: Context<Hello>) -> Result<()> {

        msg!("Hello, Solana!");

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct Hello {}