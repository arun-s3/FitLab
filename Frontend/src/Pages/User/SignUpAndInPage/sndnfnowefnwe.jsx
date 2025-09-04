return (
  <>
    <section style={bgImg} className="min-h-screen" id="signup-and-in">
      <header>
        <Header />
      </header>

      <main
        className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%]
          rounded-2xl px-6 sm:px-10
          bg-black/40 backdrop-blur-md
        `}
        style={type === "signup" ? { marginBlock: "10%" } : { marginBlock: "2%" }}
      >
        <h1 className="text-secondary font-funCity text-3xl sm:text-4xl mb-10 text-left my-10">
          SIGN
          <span className="font-funCity"> {type.slice(4).toUpperCase()} </span>
        </h1>

        <form
          className="flex flex-col gap-4 text-descReg1 items-start"
          onSubmit={(e) => submitData(e)}
        >
          <div className="w-full">
            {type === "signup" ? (
              <>
                <label htmlFor="email">Enter your email address</label>
                <input
                  type="email"
                  placeholder="Email Address"
                  id="email"
                  className="w-full"
                  onChange={(e) => handleChange(e)}
                  autoFocus
                  onBlur={(e) => {
                    handleInput(e);
                  }}
                  value={formData.email}
                />
              </>
            ) : (
              <>
                <label htmlFor="identifier">Enter your username or email address</label>
                <input
                  type="text"
                  placeholder="Username or email address"
                  id="identifier"
                  className="w-full"
                  autoComplete="off"
                  ref={identifierRef}
                  onChange={(e) => handleChange(e)}
                  onBlur={(e) => {
                    handleInput(e);
                  }}
                />
              </>
            )}
            <p className="error"></p>
          </div>

          {type === "signup" && (
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="flex-1">
                <label htmlFor="username">User Name</label>
                <input
                  type="text"
                  placeholder="Username"
                  id="username"
                  className="w-full"
                  onChange={(e) => handleChange(e)}
                  onBlur={(e) => {
                    handleInput(e);
                  }}
                  value={formData.username}
                />
                <p className="error"></p>
              </div>
              <div className="flex-1">
                <label htmlFor="mobile">Contact Number</label>
                <input
                  type="text"
                  placeholder="Contact Number"
                  id="mobile"
                  className="w-full"
                  onChange={(e) => handleChange(e)}
                  onBlur={(e) => {
                    handleInput(e);
                  }}
                  value={formData.mobile}
                />
                <p className="error"></p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            <div>
              <label htmlFor="password">Enter your Password</label>
              <input
                type="password"
                placeholder="Password"
                id="password"
                className="w-full"
                onChange={(e) => handleChange(e)}
                autoComplete="off"
                ref={passwordRef}
                onBlur={(e) => {
                  handleInput(e);
                }}
              />
              <p className="error"></p>
            </div>

            {type === "signup" ? (
              <div>
                <label htmlFor="confirmPassword">Confirm your Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  id="confirmPassword"
                  className="w-full"
                  onBlur={(e) => {
                    handleInput(e);
                  }}
                  onChange={(e) => handleChange(e)}
                />
                <p className="error"></p>

                <p className="text-white mt-4 text-sm ml-1">
                  Already have an account?
                  <Link
                    to="/signin"
                    className="text-secondary ml-2 cursor-pointer font-medium"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            ) : (
              <div className="text-white mt-2 flex flex-col sm:flex-row justify-between text-sm">
                <p className="ml-1">
                  Don’t have an account yet?
                  <Link
                    to="/signup"
                    className="text-secondary ml-2 cursor-pointer font-medium"
                  >
                    Sign Up
                  </Link>
                </p>
                <Link to="">Forgot Password</Link>
              </div>
            )}
          </div>

          <SiteButtonSquare
            shouldSubmit={true}
            customStyle={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: type === "signup" ? "1.5rem" : "3rem",
            }}
          >
            {loading ? (
              <CustomHashLoader loading={loading} />
            ) : otpPageLoading ? (
              <span className="flex justify-center items-center gap-2">
                <span className="text-secondary text-xs tracking-wide">
                  Redirecting to OTP Verification Page
                </span>
                <CustomScaleLoader loading={true} />
              </span>
            ) : (
              "Sign " + type.slice(4, 5).toUpperCase() + type.slice(5)
            )}
          </SiteButtonSquare>

          {type === "signup" && (
            <SiteSecondaryBorderButtonSquare
              customStyle={{
                marginBottom: "3rem",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              clickHandler={() => {
                setGooglePromptLoading(true);
                googleLogin();
              }}
            >
              <img src="/google.png" alt="" className="mr-4 inline-block" />
              {loading || googlePromptLoading ? (
                <CustomHashLoader loading={googlePromptLoading || loading} />
              ) : (
                "Continue with Google"
              )}
            </SiteSecondaryBorderButtonSquare>
          )}
        </form>
      </main>
    </section>
    <Footer />
  </>
);
