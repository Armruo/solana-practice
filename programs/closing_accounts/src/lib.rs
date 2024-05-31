use anchor_lang::prelude::*;

declare_id!("Gh7895EyGjUcydewvx19EP6xFqS3Wptdq8k6pxgbU1XH");

#[program]
pub mod closing_accounts_secure {
    use super::*;

    pub fn close(ctx: Context<Close>) -> Result<()> {
        let dest_starting_lamports = ctx.accounts.destination.lamports();

        **ctx.accounts.destination.lamports.borrow_mut() = dest_starting_lamports
            .checked_add(ctx.accounts.account.to_account_info().lamports())
            .unwrap();
        **ctx.accounts.account.to_account_info().lamports.borrow_mut() = 0;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Close<'info> {
    account: Account<'info, Data>,
    destination: AccountInfo<'info>,
}

#[account]
pub struct Data {
    data: u64,
}
