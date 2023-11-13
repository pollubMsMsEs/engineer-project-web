import WorkInstance from "../models/workInstance.js";
import { Request, Response } from "express";
import { inspect } from "util";
import Debug from "debug";
import mongoose from "mongoose";
const debug = Debug("project:dev");

interface ReportQuery {
    type?: string;
    title?: string;
    person?: string;
}

export async function handleReport(req: Request | any, res: Response) {
    const reportType = req.params.reportType;

    try {
        let result;
        let responseData;

        switch (reportType) {
            case "average_completion_time":
                result = await getAverageCompletionTime(req);
                responseData = { average_completion_time: result };
                break;
            case "average_rating":
                result = await getAverageRating(req);
                responseData = { average_rating: result };
                break;
            case "count_by_type":
                result = await getCountByType(req);
                responseData = {
                    count_by_type: {
                        book: result[0],
                        movie: result[1],
                        game: result[2],
                    },
                };
                break;
            case "completions_by_date":
                result = await getCompletionsByDate(req);
                responseData = { completions_by_date: result };
                break;
            case "finished_count":
                result = await getFinishedCount(req);
                responseData = { finished_count: result };
                break;
            default:
                return res.status(400).json({
                    acknowledged: false,
                    errors: "Invalid report type",
                });
        }

        return res.json({ acknowledged: true, ...responseData });
    } catch (error) {
        return res.status(500).json({
            acknowledged: false,
            errors: "Internal Server Error",
        });
    }
}

function generateQueryConditions(query: ReportQuery) {
    const conditions = [];

    if (query.type) {
        const typesArray =
            typeof query.type === "string" ? query.type.split(",") : query.type;
        conditions.push({ "work_details.type": { $in: typesArray } });
    }

    if (query.title) {
        conditions.push({ "work_details.title": new RegExp(query.title, "i") });
    }

    if (query.person) {
        conditions.push({
            $or: [
                {
                    "work_details.people.person_info.name": new RegExp(
                        query.person,
                        "i"
                    ),
                },
                {
                    "work_details.people.person_info.nick": new RegExp(
                        query.person,
                        "i"
                    ),
                },
                {
                    "work_details.people.person_info.surname": new RegExp(
                        query.person,
                        "i"
                    ),
                },
            ],
        });
    }

    return conditions;
}

async function getAverageCompletionTime(req: Request | any) {
    const conditions = generateQueryConditions(req.query as ReportQuery);
    const userId = new mongoose.Types.ObjectId(req.auth._id);

    const isPersonQueryPresent = conditions.some((cond) => cond["$or"]);

    const facetPipeline = {
        works: [
            { $match: { onModel: "Work" } },
            {
                $lookup: {
                    from: "works",
                    localField: "work_id",
                    foreignField: "_id",
                    as: "work_details",
                },
            },
            { $unwind: "$work_details" },
            {
                $lookup: {
                    from: "people",
                    localField: "work_details.people.person_id",
                    foreignField: "_id",
                    as: "work_details.people.person_info",
                },
            },
            { $unwind: "$work_details.people.person_info" },
            ...(conditions.length > 0
                ? [{ $match: { $and: conditions } }]
                : []),
            {
                $project: {
                    completionTime: {
                        $subtract: ["$finished_at", "$began_at"],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$completionTime" },
                    count: { $sum: 1 },
                },
            },
        ],
        ...(isPersonQueryPresent
            ? {}
            : {
                  worksFromAPI: [
                      { $match: { onModel: "WorkFromAPI" } },
                      {
                          $lookup: {
                              from: "worksFromAPI",
                              localField: "work_id",
                              foreignField: "_id",
                              as: "work_details",
                          },
                      },
                      { $unwind: "$work_details" },
                      ...(conditions.filter((cond) => !cond["$or"]).length > 0
                          ? [
                                {
                                    $match: {
                                        $and: conditions.filter(
                                            (cond) => !cond["$or"]
                                        ),
                                    },
                                },
                            ]
                          : []),
                      {
                          $project: {
                              completionTime: {
                                  $subtract: ["$finished_at", "$began_at"],
                              },
                          },
                      },
                      {
                          $group: {
                              _id: null,
                              total: { $sum: "$completionTime" },
                              count: { $sum: 1 },
                          },
                      },
                  ],
              }),
    };

    const result = await WorkInstance.aggregate([
        { $match: { user_id: userId } },
        { $facet: facetPipeline },
    ]).exec();

    const worksResult = result[0].works?.[0];
    const worksFromApiResult = result[0].worksFromAPI?.[0];
    const totalCompletionTime =
        (worksResult ? worksResult.total : 0) +
        (worksFromApiResult ? worksFromApiResult.total : 0);
    const totalCount =
        (worksResult ? worksResult.count : 0) +
        (worksFromApiResult ? worksFromApiResult.count : 0);

    return totalCount > 0 ? totalCompletionTime / totalCount : 0;
}

async function getAverageRating(req: Request | any) {
    const conditions = generateQueryConditions(req.query as ReportQuery);
    const userId = new mongoose.Types.ObjectId(req.auth._id);

    const isPersonQueryPresent = conditions.some((cond) => cond["$or"]);

    const facetPipeline = {
        works: [
            { $match: { onModel: "Work" } },
            {
                $lookup: {
                    from: "works",
                    localField: "work_id",
                    foreignField: "_id",
                    as: "work_details",
                },
            },
            { $unwind: "$work_details" },
            {
                $lookup: {
                    from: "people",
                    localField: "work_details.people.person_id",
                    foreignField: "_id",
                    as: "work_details.people.person_info",
                },
            },
            { $unwind: "$work_details.people.person_info" },
            ...(conditions.length > 0
                ? [{ $match: { $and: conditions } }]
                : []),
            {
                $group: {
                    _id: null,
                    sumRating: { $sum: "$rating" },
                    count: { $sum: 1 },
                },
            },
        ],
        ...(isPersonQueryPresent
            ? {}
            : {
                  worksFromAPI: [
                      { $match: { onModel: "WorkFromAPI" } },
                      {
                          $lookup: {
                              from: "worksFromAPI",
                              localField: "work_id",
                              foreignField: "_id",
                              as: "work_details",
                          },
                      },
                      { $unwind: "$work_details" },
                      ...(conditions.filter((cond) => !cond["$or"]).length > 0
                          ? [
                                {
                                    $match: {
                                        $and: conditions.filter(
                                            (cond) => !cond["$or"]
                                        ),
                                    },
                                },
                            ]
                          : []),
                      {
                          $group: {
                              _id: null,
                              sumRating: { $sum: "$rating" },
                              count: { $sum: 1 },
                          },
                      },
                  ],
              }),
    };

    const result = await WorkInstance.aggregate([
        { $match: { user_id: userId } },
        { $facet: facetPipeline },
    ]).exec();

    const worksResult = result[0].works?.[0];
    const worksFromApiResult = result[0].worksFromAPI?.[0];
    const totalRating =
        (worksResult ? worksResult.sumRating : 0) +
        (worksFromApiResult ? worksFromApiResult.sumRating : 0);
    const totalCount =
        (worksResult ? worksResult.count : 0) +
        (worksFromApiResult ? worksFromApiResult.count : 0);

    return totalCount > 0 ? totalRating / totalCount : 0;
}

async function getCountByType(req: Request | any) {
    const conditions = generateQueryConditions(req.query as ReportQuery);
    const userId = new mongoose.Types.ObjectId(req.auth._id);

    const isPersonQueryPresent = conditions.some((cond) => cond["$or"]);

    const facetPipeline = {
        works: [
            { $match: { onModel: "Work" } },
            {
                $lookup: {
                    from: "works",
                    localField: "work_id",
                    foreignField: "_id",
                    as: "work_details",
                },
            },
            { $unwind: "$work_details" },
            {
                $lookup: {
                    from: "people",
                    localField: "work_details.people.person_id",
                    foreignField: "_id",
                    as: "work_details.people.person_info",
                },
            },
            { $unwind: "$work_details.people.person_info" },
            ...(conditions.length > 0
                ? [{ $match: { $and: conditions } }]
                : []),
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 },
                },
            },
        ],
        ...(isPersonQueryPresent
            ? {}
            : {
                  worksFromAPI: [
                      { $match: { onModel: "WorkFromAPI" } },
                      {
                          $lookup: {
                              from: "worksFromAPI",
                              localField: "work_id",
                              foreignField: "_id",
                              as: "work_details",
                          },
                      },
                      { $unwind: "$work_details" },
                      ...(conditions.filter((cond) => !cond["$or"]).length > 0
                          ? [
                                {
                                    $match: {
                                        $and: conditions.filter(
                                            (cond) => !cond["$or"]
                                        ),
                                    },
                                },
                            ]
                          : []),
                      {
                          $group: {
                              _id: "$type",
                              count: { $sum: 1 },
                          },
                      },
                  ],
              }),
    };

    const result = await WorkInstance.aggregate([
        { $match: { user_id: userId } },
        { $facet: facetPipeline },
    ]).exec();

    const combinedResults = [
        ...(result[0].works ?? []),
        ...(result[0].worksFromAPI ?? []),
    ];

    const countByType = combinedResults.reduce((acc, item) => {
        acc[item._id] = (acc[item._id] || 0) + item.count;
        return acc;
    }, {});

    const finalResults = [
        countByType["book"] || 0,
        countByType["movie"] || 0,
        countByType["game"] || 0,
    ];

    return finalResults;
}

async function getCompletionsByDate(req: Request | any) {
    const conditions = generateQueryConditions(req.query as ReportQuery);
    const userId = new mongoose.Types.ObjectId(req.auth._id);

    const isPersonQueryPresent = conditions.some((cond) => cond["$or"]);

    const facetPipeline = {
        works: [
            { $match: { onModel: "Work" } },
            {
                $lookup: {
                    from: "works",
                    localField: "work_id",
                    foreignField: "_id",
                    as: "work_details",
                },
            },
            { $unwind: "$work_details" },
            {
                $lookup: {
                    from: "people",
                    localField: "work_details.people.person_id",
                    foreignField: "_id",
                    as: "work_details.people.person_info",
                },
            },
            { $unwind: "$work_details.people.person_info" },
            { $unwind: "$completions" },
            ...(conditions.length > 0
                ? [{ $match: { $and: conditions } }]
                : []),
            {
                $project: {
                    completionDate: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$completions",
                        },
                    },
                },
            },
            {
                $group: {
                    _id: "$completionDate",
                    completedCount: {
                        $sum: 1,
                    },
                },
            },
        ],
        ...(isPersonQueryPresent
            ? {}
            : {
                  worksFromAPI: [
                      { $match: { onModel: "WorkFromAPI" } },
                      {
                          $lookup: {
                              from: "worksFromAPI",
                              localField: "work_id",
                              foreignField: "_id",
                              as: "work_details",
                          },
                      },
                      { $unwind: "$work_details" },
                      { $unwind: "$completions" },
                      ...(conditions.filter((cond) => !cond["$or"]).length > 0
                          ? [
                                {
                                    $match: {
                                        $and: conditions.filter(
                                            (cond) => !cond["$or"]
                                        ),
                                    },
                                },
                            ]
                          : []),
                      {
                          $project: {
                              completionDate: {
                                  $dateToString: {
                                      format: "%Y-%m-%d",
                                      date: "$completions",
                                  },
                              },
                          },
                      },
                      {
                          $group: {
                              _id: "$completionDate",
                              completedCount: {
                                  $sum: 1,
                              },
                          },
                      },
                  ],
              }),
    };

    const result = await WorkInstance.aggregate([
        { $match: { user_id: userId } },
        { $facet: facetPipeline },
    ]).exec();

    const combinedResults = [
        ...(result[0].works ?? []),
        ...(result[0].worksFromAPI ?? []),
    ];

    const sumResults = combinedResults.reduce((acc, item) => {
        acc[item._id] = (acc[item._id] || 0) + item.completedCount;
        return acc;
    }, {});

    const sortedResults = Object.entries(sumResults)
        .map(([date, count]) => ({ day: date, total: count }))
        .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

    return sortedResults;
}

async function getFinishedCount(req: Request | any) {
    const conditions = generateQueryConditions(req.query as ReportQuery);
    const userId = new mongoose.Types.ObjectId(req.auth._id);

    const isPersonQueryPresent = conditions.some((cond) => cond["$or"]);

    const facetPipeline = {
        works: [
            { $match: { onModel: "Work" } },
            {
                $lookup: {
                    from: "works",
                    localField: "work_id",
                    foreignField: "_id",
                    as: "work_details",
                },
            },
            { $unwind: "$work_details" },
            {
                $lookup: {
                    from: "people",
                    localField: "work_details.people.person_id",
                    foreignField: "_id",
                    as: "work_details.people.person_info",
                },
            },
            { $unwind: "$work_details.people.person_info" },
            ...(conditions.length > 0
                ? [{ $match: { $and: conditions } }]
                : []),
            {
                $group: {
                    _id: null,
                    completedCount: {
                        $sum: {
                            $cond: [
                                { $gt: ["$number_of_completions", 0] },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ],
        ...(isPersonQueryPresent
            ? {}
            : {
                  worksFromAPI: [
                      { $match: { onModel: "WorkFromAPI" } },
                      {
                          $lookup: {
                              from: "worksFromAPI",
                              localField: "work_id",
                              foreignField: "_id",
                              as: "work_details",
                          },
                      },
                      { $unwind: "$work_details" },
                      ...(conditions.filter((cond) => !cond["$or"]).length > 0
                          ? [
                                {
                                    $match: {
                                        $and: conditions.filter(
                                            (cond) => !cond["$or"]
                                        ),
                                    },
                                },
                            ]
                          : []),
                      {
                          $group: {
                              _id: null,
                              completedCount: {
                                  $sum: {
                                      $cond: [
                                          {
                                              $gt: [
                                                  "$number_of_completions",
                                                  0,
                                              ],
                                          },
                                          1,
                                          0,
                                      ],
                                  },
                              },
                          },
                      },
                  ],
              }),
    };

    const result = await WorkInstance.aggregate([
        { $match: { user_id: userId } },
        { $facet: facetPipeline },
    ]).exec();

    const worksResult = result[0].works?.[0];
    const worksFromApiResult = result[0].worksFromAPI?.[0];
    const totalCompletedCount =
        (worksResult ? worksResult.completedCount : 0) +
        (worksFromApiResult ? worksFromApiResult.completedCount : 0);

    return totalCompletedCount;
}
