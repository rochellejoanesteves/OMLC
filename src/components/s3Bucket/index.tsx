import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
import axios from "axios";
import Folder from "../folder";
import { file } from "@babel/types";

interface MyComponentProps {
  files: string[]; // replace string[] with the type of your files
  setFiles: any; // adjust the type as needed;
  getUploadedFiles: any;
  filteredData: any;
}
const S3BucketExplorer: React.FC<MyComponentProps> = ({
  files,
  filteredData,
  getUploadedFiles,
}) => {
  useEffect(() => {
    getUploadedFiles();
  }, []);

  const handleDownload = (key: string) => {
    const s3 = new AWS.S3({
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_REGION,
    });

    const params = {
      Bucket: "omlc-poc-fe",
      Key: key,
    };

    s3.getObject(params, (err: any, data: any) => {
      if (err) {
        console.error("Error downloading file from S3:", err);
      } else {
        // Convert the data.Body to a Blob
        const blob = new Blob([data.Body]);

        // Create a download link
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = key;
        link.click();

        // Clean up
        URL.revokeObjectURL(link.href);
      }
    });
  };

  return (
    <div>
      <Folder name="omlc-poc-fe">
        {filteredData.map((obj: any, index: any) => {
          const objectName = Object.keys(obj)[0]; // Get the object name
          const array = obj[objectName].slice(1); // Get the array

          return (
            <div key={index}>
              <Folder name={objectName} key={index}>
                <div>
                  {array.map((item: any, itemIndex: any) => (
                    <div key={itemIndex}>
                      {item.Key}{" "}
                      <button onClick={() => handleDownload(item.Key)}>
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </Folder>
            </div>
          );
        })}
      </Folder>
    </div>
  );
};

export default S3BucketExplorer;
