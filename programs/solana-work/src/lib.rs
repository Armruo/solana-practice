use anchor_lang::prelude::*;

declare_id!("BqLqm3KGicFQfr9tGeuXGbHrRZV95voXEECHphxCxicW");

#[program]
pub mod solana_work {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn hello(_ctx: Context<Hello>) -> Result<()> {

        msg!("Hello, Solana!");
        msg!("Our program's Program ID: {}", &id());

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct Hello {}
