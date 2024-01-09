import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AWS, { S3 } from "aws-sdk";
import DropZone from "../../components/dropzone";
import S3BucketExplorer from "../../components/s3Bucket";
import Folder from "../../components/folder";

const S3_BUCKET = "omlc-poc-fe";
const REGION = process.env.REACT_APP_REGION;

AWS.config.update({
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
 });

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

function Home() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [totalSize, setTotalSize] = useState(0);

  const [fileUpload, setFileUpload] = useState<any>("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [files, setFiles] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const name = localStorage.getItem("USER_NAME");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleFileUpload = (files: File[]) => {
    setFileUpload(files);
  };

  const getUploadedFiles = () => {
    const s3 = new AWS.S3({
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_REGION,
    });

    const params = {
      Bucket: "omlc-poc-fe",
    };

    s3.listObjectsV2(params, (err: any, data: any) => {
      if (err) {
        console.error("Error listing objects in S3:", err);
      } else {
        setFiles(data.Contents);
        const keys: any = [];
        data.Contents.forEach((data: any) => {
          const keyIndex = data.Key.indexOf("/");
          const key = data.Key.slice(0, keyIndex);
          if (!keys.includes(key)) {
            keys.push(key);
          }
        });
        let filteredData: any = [];
        keys.forEach((key: any) => {
          const filteredItems: any = {};
          data.Contents.filter((item: any) => {
            if (item.Key?.includes(key)) {
              filteredItems[key] = [...(filteredItems[key] || []), item];
            }
          });
          filteredData = [...filteredData, filteredItems];
        });
        setFilteredData(filteredData);
      }
    });
  };

  const handleSubmit = async () => {
    if (!fileUpload) return;

    Array.from(fileUpload).forEach(async (file: any) => {
      const folderPath = `${name}/`;
      const key = folderPath + file.name;
      const params = {
        Bucket: S3_BUCKET,
        Key: key,
        Body: file,
        ACL: "public-read",
        ContentType: file.type,
      };

      try {
        if (totalSize <= 200) {
          myBucket
            .putObject(params)
            .on("httpUploadProgress", (evt) => {
              setProgress(Math.round((evt.loaded / evt.total) * 100));
            })
            .send((err) => {
              if (err) console.log(err);
            });

          alert("success");
          setUploadedFiles([]);
        } else {
          alert("NOT ALLOWED");
        }
      } catch (error) {
        console.error("Error uploading file:");
      } finally {
        getUploadedFiles();
      }
    });
  };
  return (
    <div style={{ width: "50%" }}>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div>Specify documents to Upload</div>
          <div>
            <button onClick={handleSubmit}>Submit</button>
            <button
              style={{
                marginLeft: "5px",
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        <hr />
        <div>
          <DropZone
            totalSize={totalSize}
            setTotalSize={setTotalSize}
            setUploadedFiles={setUploadedFiles}
            uploadedFiles={uploadedFiles}
            onFileUpload={handleFileUpload}
          />
        </div>
      </div>
      <S3BucketExplorer
        files={files}
        setFiles={setFiles}
        getUploadedFiles={getUploadedFiles}
        filteredData={filteredData}
      />
    </div>
  );
}

export default Home;
