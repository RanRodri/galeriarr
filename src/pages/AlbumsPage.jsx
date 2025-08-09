export default function AlbumsPage() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Header omitido intencionalmente */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="@[480px]:px-4 @[480px]:py-3">
                <div
                  className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-white @[480px]:rounded-lg min-h-80"
                  style={{
                    backgroundImage:
                      "linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBP8zsBHusqvHTeuWv2cSnmQLQGGyTvKutXWClYwo_jSip1ld2rnNYxbqDqAqVa7LW4LmU6RiSh-ldNUsx0zTgoHHsqtjKBrTTYSZ1Evg9w6ekY-FpfULPe4jxWz49HiBuR2Xx3laDkfu6nLly4-_ay6il_rRApmycHD1qJajYT01J-E506U9Ia1zV_ta6bseQzBGlkq5uckUhHR-e-_6SVsXF8ZP8FdyJbGU3vK-MWNOuoE788nz7NElvU_QRvFXEB_opryWMqhoFe')",
                  }}
                >
                  <div className="flex p-4">
                    <p className="text-white tracking-light text-[28px] font-bold leading-tight">My Recent Memories</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-stretch p-4 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col"
                      style={{
                        backgroundImage:
                          [
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC3i_ul3qz_bsebxqGaqRPkuY6jODD_2URDsI4l5yYY6ss2BitKnVftWVvw7qD9isz8kS6eoSD6HsTyLMvusJVzqrQke5QTZAmozIo7aEdwDKq2ZdaMcZihLsddysg3Y6wB8C37g5I6tnddwMfwpnGn6MP1BrmrHcJv068si0r3xCwaziQN0O6GvulKrpoZMDeore3Oq3i8OO-WwGt1rsEnL2iBVaEjdUAQg-OQS7P--LSqkJWoFsnaxqcfFtAMcRlvBCrT2nOvhHiB')",
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD-Mq7aAc9Dz1YevQwWPYSWIKbWyNJgObdAPcu9w1Occ5Ux-bF7thBSVgpey7ydrHU7_38aR_GdQdGGSGQSF4LoZv0gmD7cpV4oWyzBAutqui_m1788ofSXWPYP9pkEAPWHY5oWoMuVs_GQDQMPFz2OzkLjHUix-YKuGPl7lrj4sNjlSTp61zPvVUvzzf_kdFXZkDZZB3AMxqJl4lEIEJHqueYztvUqwxYyVbQjWSEfrm43d3glRjxyUpza5UztTyCfrh80g8lloolC')",
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDll11QpYiMX82CjKkB_qoJJjMeafJEAAIZPTyXc_CI0_5SlR_fCIu3XOdY0lkQVzHwyhUFKNFK92sxtXeaRx2ukfUYsUfUyjzgnhHZ6UGLP_q3-ikPI_S01YxyC8ibPnGMyIVU1D_5xI4jVV2Uxfc4TFA3a4c2K1Q0DekKX6zaIKG0UoE9enb29GnlFxBgMDclnX7JIRG4lCqtYHz1-kxK1a00Fp8T0f-BWZc_JsFXwHeu2KOTQiqkjhed7OrD14uZV3OXYDK2rHY9')",
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBjjVq9UOOZS7YIB0f_qcQLKzhEKI7YtcvaB6gQcbkmyYHaRaJNBMYwVJcGJ-hfdB9RXmNGCwLj2hzvCXsyat1U76Sf9jkbrVLKlsuFGO9Sox02EPfNtS7ITksn8eOdSkQqVAkBrG0gAmKKAJygbU8du-CbYmu4Juiok3toZdHwVUtjUkmz3zcpXicAaVhw-TvftVo2gc_Tn1Tlggk6n4u5rNIRcd2TjoN31ptHIhOO0ubsW9qt_xuoigeAe3SgWNurq_QY-ZletRbP')",
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCRXmeJlkrgF_W-L-e0ZyzMgdO02baXT475vDf1iFMZlT2pOqvHm2_2Lz-Mq8fsPCAbrYdxGrVzdVoRTTVVD5a-jHB2x1NeK5HTw7kXr1YGhRxZCW_2ViCmTZcYM5JS1rsfzTSizKAwD6w-dZngeponqBtnhHUl2qXcjWXQZQRH-sYaX14c50dZ8yGs5HiUUR9hzdgr5HAh9kcSpUXvB59TE9TStF7pI7Gst6ZKEv02q4KYVtKF453WlitjG5cG1ZKyYhjdoE6TUgvx')",
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDNoK9DSFY0XH71CIJ-JDw9GgBgsz16XCEukbSN8PEhsfe-bwBbAqJOosVbWUOgtjwprVk_XvCAgA6tfqDeBx_RD_gztkEC_tTaPxTwE5KHHz9v1BUQiOWoR59SMjAMSCq7n81aKs_VzWQgOT1DGAmqUpjEaA262BZs4r5-Ay11y9ips9tLcxoYvELdcgagqMHm35-hENFXXv76JoFJyX4m_s_19a6oBx-ZZUi2vlLyqXESYtz-VJ4LG7Re7ONOYUuBh1oHPCjp0_88')",
                          ][i - 1],
                      }}
                    />
                    <div>
                      <p className="text-[#111518] text-base font-medium leading-normal">
                        {[
                          'Summer Vacation',
                          'Family Reunion',
                          'Wedding',
                          'Baby Shower',
                          'Road Trip',
                          'Graduation',
                        ][i - 1]}
                      </p>
                      <p className="text-[#637c88] text-sm font-normal leading-normal">
                        {[
                          '120 photos',
                          '85 photos',
                          '250 photos',
                          '60 photos',
                          '150 photos',
                          '100 photos',
                        ][i - 1]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

