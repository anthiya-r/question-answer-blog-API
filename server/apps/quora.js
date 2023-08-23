import { ObjectId } from "mongodb";
import { Router } from "express";
import { db } from "../utils/db.js";
import validateCharacterLength from "../middleware/validateCharacter.js";

const quoraRouter = Router();

quoraRouter.get("/questions", async (req, res) => {
  // http://localhost:4000/quora/questions?category=software&topic=test
  const topic = req.query.topic;
  const category = req.query.category;
  const page = parseInt(req.query.page) || 1;
  const dataPerPage = 5;
  const query = {};

  if (topic) {
    query.topic = { $regex: new RegExp(topic, "i") };
  }

  if (category) {
    query.category = { $regex: new RegExp(category, "i") };
  }
  try {
    const collection = db.collection("quora");
    const totalData = await collection.countDocuments(query);
    const totalPages = Math.ceil(totalData / dataPerPage);
    const skip = (page - 1) * dataPerPage;
    const quoraData = await collection
      .find(query)
      .skip(skip)
      .limit(dataPerPage)
      .toArray();

    return res.status(200).json({
      data: quoraData,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        dataPerPage: dataPerPage,
        totalData: totalData,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

quoraRouter.get("/questions/:questionId", async (req, res) => {
  try {
    const collection = db.collection("quora");
    const questionId = new ObjectId(req.params.questionId);
    const quoraDataById = await collection.findOne({ _id: questionId });

    if (!quoraDataById) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json({ data: quoraDataById });
  } catch (error) {
    console.error("error", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

quoraRouter.post("/questions", async (req, res) => {
  try {
    const collection = db.collection("quora");
    const questionBody = {
      ...req.body,
      created_at: new Date(),
      modified_at: new Date(),
      likes: 0,
    };
    await collection.insertOne(questionBody);
    return res.status(201).json({
      message: "Question has been created successfully",
      data: questionBody,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

quoraRouter.put("/questions/:questionId", async (req, res) => {
  try {
    const collection = db.collection("quora");
    const questionId = new ObjectId(req.params.questionId);
    const questionBody = { ...req.body, modified_at: new Date() };
    await collection.updateOne({ _id: questionId }, { $set: questionBody });
    return res.status(201).json({
      message: "Question has been updated successfully",
      data: questionBody,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

quoraRouter.delete("/questions/:questionId", async (req, res) => {
  try {
    const collection = db.collection("quora");
    const questionId = new ObjectId(req.params.questionId);
    await collection.deleteOne({ _id: questionId });
    return res.status(200).json({
      message: "Question and answer has been deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

quoraRouter.post(
  "/questions/:questionId/answers",
  validateCharacterLength,
  async (req, res) => {
    try {
      const collection = db.collection("quora");
      const questionId = new ObjectId(req.params.questionId);
      const answerId = new ObjectId(req.params.answerId);
      const answerData = {
        _id: answerId,
        ...req.body,
        created_at: new Date(),
        likes: 0,
      };

      const result = await collection.updateOne(
        { _id: questionId },
        { $push: { answers: answerData } }
      );

      if (result.modifiedCount === 1) {
        // console.log("Document was modified.");
        res.status(201).json({
          message: "Answer has been created successfully",
          data: answerData,
        });
      } else {
        // console.log("Document was not modified.");
        res.status(404).json({ message: "Question not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "An error occurred" });
    }
  }
);

quoraRouter.get("/questions/:questionId/answers", async (req, res) => {
  try {
    const collection = db.collection("quora");
    const questionId = new ObjectId(req.params.questionId);
    const quoraData = await collection.findOne({ _id: questionId });

    if (questionId) {
      res.status(200).json({
        data: quoraData,
      });
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
});

quoraRouter.get(
  "/questions/:questionId/answers/:answerId",
  async (req, res) => {
    try {
      const collection = db.collection("quora");
      const questionId = new ObjectId(req.params.questionId);
      const answerId = new ObjectId(req.params.answerId);
      const answerData = await collection.findOne({
        _id: questionId,
        "answers._id": answerId,
      });

      if (!answerData || !answerData.answers[0]) {
        return res.status(404).json({ message: "Answer not found" });
      }

      const answer = answerData.answers[0];
      return res.status(200).json({ data: answer });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "An error occurred" });
    }
  }
);

quoraRouter.delete(
  "/questions/:questionId/answers/:answerId",
  async (req, res) => {
    try {
      const collection = db.collection("quora");
      const questionId = new ObjectId(req.params.questionId);
      const answerId = new ObjectId(req.params.answerId);

      const result = await collection.updateOne(
        { _id: questionId },
        { $pull: { answers: { _id: answerId } } }
      );

      if (result.modifiedCount === 1) {
        res.status(200).json({
          message: "Answer has been deleted successfully",
        });
      } else {
        res.status(404).json({ message: "Question or answer not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  }
);

quoraRouter.put("/questions/:questionId/like-dislike", async (req, res) => {
  try {
    const collection = db.collection("quora");
    const questionId = new ObjectId(req.params.questionId);
    const { action } = req.body;

    const result = await collection.updateOne(
      { _id: questionId },
      { $inc: { likes: action === "like" ? 1 : -1 } }
    );

    if (result.modifiedCount === 1) {
      const updatedQuestionData = await collection.findOne({ _id: questionId });
      res.status(200).json({
        message: "Voting successful",
        data: updatedQuestionData.likes,
      });
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

quoraRouter.put(
  "/questions/:questionId/answers/:answerId/like-dislike",
  async (req, res) => {
    try {
      const collection = db.collection("quora");
      const questionId = new ObjectId(req.params.questionId);
      const answerId = new ObjectId(req.params.answerId);
      const { action } = req.body;

      const updateOperator = action === "like" ? 1 : -1;

      const result = await collection.updateOne(
        { _id: questionId, "answers._id": answerId },
        { $inc: { "answers.$.likes": updateOperator } }
      );

      if (result.modifiedCount === 1) {
        const updatedAnswerData = await collection.findOne({
          _id: questionId,
          "answers._id": answerId,
        });

        if (updatedAnswerData) {
          const updatedLikes = updatedAnswerData.answers.find(
            (answer) => answer._id.toString() === answerId.toString()
          ).likes;
          res.status(201).json({
            message: "Voting successful",
            data: updatedLikes,
          });
        } else {
          res.status(404).json({ message: "Answer not found" });
        }
      } else {
        res.status(404).json({ message: "Answer not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  }
);

export default quoraRouter;
