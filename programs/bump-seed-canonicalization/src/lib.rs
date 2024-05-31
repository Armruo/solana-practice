use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("DP5cBTW4WhpSLSaTzSPfaWHWg5Pji3oGxooXHC8Eu6VF");

#[program]
pub mod bump_seed_canonicalization_secure {
    use super::*;

    pub fn set_value(ctx: Context<BumpSeed>, key: u64, new_value: u64, bump: u8) -> ProgramResult {
        let address =
            Pubkey::create_program_address(
                &[key.to_le_bytes().as_ref(), &[bump]], 
                ctx.program_id
            )?;

        if address != ctx.accounts.data.key() {
            return Err(ProgramError::InvalidArgument);
        }

        ctx.accounts.data.value = new_value;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct BumpSeed<'info> {
    data: Account<'info, Data>,
}

#[account]
pub struct Data {
    value: u64,
}

