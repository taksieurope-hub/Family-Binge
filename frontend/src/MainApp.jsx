  // Check trial / subscription status
  useEffect(() => {
    const signupDate = localStorage.getItem('familybinge_signup_date');
    const paid = localStorage.getItem('familybinge_paid') === 'true';
    const expiresStr = localStorage.getItem('familybinge_subscription_expires');

    if (paid && expiresStr) {
      const expires = new Date(expiresStr);
      if (expires > new Date()) {
        setIsTrialExpired(false);   // still valid
        return;
      }
    }

    // Free trial check
    if (signupDate) {
      const daysSinceSignup = (new Date() - new Date(signupDate)) / (1000 * 60 * 60 * 24);
      setIsTrialExpired(daysSinceSignup > 3);
    } else {
      localStorage.setItem('familybinge_signup_date', new Date().toISOString());
      setIsTrialExpired(false);
    }
  }, []);