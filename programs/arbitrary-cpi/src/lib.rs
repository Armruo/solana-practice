use anchor_lang::prelude::*;

declare_id!("FUGzMaxx8ycKK2d83LKewVz8QL8q4kVyG6tsaAecE15f");

#[program]
pub mod arbitrary_cpi {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
