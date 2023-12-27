import jwt from "jsonwebtoken";
import lodash from "lodash";
const { isEmpty, last } = lodash;
import Joi from "joi";

const ONE_MONTH_IN_SECS = "2629743";
const ONE_WEEK_IN_SECS = "604800";
const TEN_MINS_IN_SECS = "600";

const generateToken = (type, data) => {
  let expiresIn = "";
  if (type === "auth_token") {
    expiresIn = TEN_MINS_IN_SECS + "s";
  } else if (type === "invitation_token") {
    expiresIn = ONE_WEEK_IN_SECS + "s";
  } else {
    expiresIn = ONE_MONTH_IN_SECS + "s";
  }
  return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: expiresIn });
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(
      token.replace(/"/g, ""),
      process.env.TOKEN_SECRET,
    );

    return { status: true, data: decoded };
    // # TODO: Handle if token is expired
  } catch (e) {
    // console.log("Error", e)
    return { status: false };
  }
};

/* const firebaseUploadFile = async (filename, data, metadata) => {
  const storageRef = ref(
    storage,
    `/files/feeds/${filename}_${new Date().getTime()}`,
  );
  return await uploadBytes(storageRef, data)
    .then(async (snapshot) => {
      console.log("SNAPSHOT", snapshot);
      const url = await getDownloadURL(snapshot.ref).then(
        async (downloadURL) => {
          return downloadURL;
        },
      );
      return url;
    })
    .catch((error) => {
      console.log(error);
      return error.response;
    });
}; */

// This is according to the pagination design in the UI
// Example:
// Showing 1 to 10 of 100 entries
// Showing {from} to {to} of {total_filtered} entries
function generateMeta(total_filtered, page, size, count, orderBy, search) {
  const last_page = Math.ceil(total_filtered / size);
  const from = last_page < page ? 0 : (page - 1) * size + 1;
  const to = last_page < page ? 0 : from + count - 1;

  return {
    count, // count is the number of items in the current page
    total_filtered, // total_filtered is the total number of items matching the query
    page, // page is the current page number
    from, // from is the starting index of the current page
    to, // to is the ending index of the current page
    size, // size is the number of items per page
    last_page, // last_page is the last page number
    search,
    order: orderBy,
  };
}

function parseOrderBy(queryParam) {
  const orderFields = queryParam?.split(",");
  const orderByArray = [];

  orderFields.forEach((field) => {
    const [fieldName, order] = field.split(":");
    if (fieldName && order) {
      orderByArray.push({ [fieldName]: order });
    }
  });

  return orderByArray;
}

function parseQueryParams(req) {
  const page = Number(req.query.page || 1);
  const size = Number(req.query.size || 10);
  const search = req?.query?.search || "";
  const offset = (page - 1) * size;
  const orderBy = isEmpty(req.query.order)
    ? [
        {
          createdAt: "desc",
        },
      ]
    : parseOrderBy(req.query.order);

  return {
    page,
    size: size > 0 ? size : 10,
    offset,
    orderBy,
    search,
  };
}

function extractStackTraceInfo(error) {
  const line = error.stack.split("\n")[1].trim();
  const startIndex = line.indexOf("/monolith");
  return String(line.substring(startIndex)).replace(")", "");
}

function withRelationalOrder(orderBy, relationalOrderField) {
  return orderBy.map((order) => {
    const referentialOrder = relationalOrderField.find((refOrder) =>
      Object.keys(order).includes(refOrder),
    );

    return referentialOrder
      ? { [referentialOrder]: { _count: order[referentialOrder] } }
      : order;
  });
}

const generateSearchQueries = (search, fields = []) => {
  const queries = [];
  fields.forEach((field) => {
    const fieldParts = field.split(".");
    let query = {};
    let currentQuery = query;

    fieldParts.forEach((part, index) => {
      if (index === fieldParts.length - 1) {
        // Last part, set the contains filter
        currentQuery[part] = {
          contains: search,
          mode: "insensitive",
        };
      } else {
        // Nested part, create an object and move to the next level
        currentQuery[part] = {};
        currentQuery = currentQuery[part];
      }
    });

    queries.push(query);
  });

  return queries;
};

function convertBooleanParams(queryParams, fields) {
  const filteredParams = {};

  fields.forEach((param) => {
    if (queryParams[param] !== undefined) {
      filteredParams[param] = queryParams[param] === "true";
    }
  });

  return filteredParams;
}

function convertNumericParams(queryParams, fields) {
  const filteredParams = {};

  fields.forEach((param) => {
    if (queryParams[param] !== undefined) {
      filteredParams[param] = Number(queryParams[param]);
    }
  });

  return filteredParams;
}

const convertFieldsArray = (fields) => {
  return fields.reduce((acc, field) => {
    acc[field] = true;
    return acc;
  }, {});
};

export {
  generateToken,
  verifyToken,
  // firebaseUploadFile,
  generateMeta,
  parseQueryParams,
  extractStackTraceInfo,
  withRelationalOrder,
  generateSearchQueries,
  convertBooleanParams,
  convertNumericParams,
  convertFieldsArray,
};
