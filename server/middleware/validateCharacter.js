const validateCharacterLength = (req, res, next) => {
  const answerData = req.body.answer;

  if (!answerData || answerData.length > 300) {
    return res
      .status(400)
      .json({ error: "Characters cannot be more than 300 characters" });
  }

  next();
};

export default validateCharacterLength;
