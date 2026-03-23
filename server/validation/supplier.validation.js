const validateSupplier = (req, res, next) => {
  const { companyName, companyMobile } = req.body;

  if (!companyName || companyName.trim() === "") {
    return res.status(400).json({ message: "Company Name is required." });
  }

  if (companyMobile && companyMobile.length > 0) {
    const invalidPhones = companyMobile.filter(phone => phone.length !== 10);
    if (invalidPhones.length > 0) {
      return res.status(400).json({ message: "Mobile numbers must be exactly 10 digits." });
    }
  }

  next();
};

module.exports = { validateSupplier };