import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdDelete } from "react-icons/md";
import { Alert } from "antd";
import "./dropZone.scss";

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  totalSize: any;
  setTotalSize: any;
  setUploadedFiles: any;
  uploadedFiles: any;
}

const DropZone: React.FC<FileUploadProps> = ({
  onFileUpload,
  totalSize,
  setTotalSize,
  setUploadedFiles,
  uploadedFiles,
}) => {
  const [isUploadSuccess, setUploadSuccess] = useState(false);
  const user: string | null = localStorage.getItem("USER_NAME") || "";

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
      onFileUpload([...uploadedFiles, ...acceptedFiles]);
      setUploadSuccess(true); // Set success status to true
      setTimeout(() => setUploadSuccess(false), 3000); // Hide success message after 3 seconds
    },
    [onFileUpload, uploadedFiles]
  );

  const deleteFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    onFileUpload(newFiles);
  };

  const bytesToMB = (bytes: any) => {
    const megabytes = bytes / (1024 * 1024);
    return Number(megabytes.toFixed(2)); // Returns a number with two decimal places
  };

  useEffect(() => {
    // Calculate the total size of all uploaded files
    const calculateTotalSize = () => {
      let total = 0;
      uploadedFiles.forEach((file: any) => {
        total += bytesToMB(file.size);
      });
      return total;
    };

    // Set the total size in the state
    setTotalSize(calculateTotalSize());
  }, [uploadedFiles, setTotalSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <div
        style={{
          display: "flex",
        }}
      >
        <label htmlFor="userInput" style={{ width: "30%" }}>
          Custodian Name<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          id="userInput"
          value={user}
          disabled
          style={{
            width: "70%",
            fontSize: "12pt",
            marginBottom: "5px",
            marginTop: "5px",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
        }}
      >
        <label htmlFor="dropInput" style={{ width: "30%" }}>
          File Selection<span style={{ color: "red" }}>*</span>
        </label>
        <div {...getRootProps()} className="dropZoneContainer">
          <input multiple id="dropInput" {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here</p>
          ) : (
            <p>
              Drop the files here <br /> or <br /> <button>Select Files</button>
            </p>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            width: "30%",
          }}
        ></div>
        <div
          style={{
            width: "70%",
          }}
        >
          <p>The maximum file upload is up to 200 MB.</p>

          {isUploadSuccess && (
            <div>
              <Alert
                message="Successfully Uploaded"
                type="success"
                showIcon
                banner
              />
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Progress</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedFiles.map((file: any, index: any) => (
                    <tr key={index}>
                      <td>{file?.name}</td>
                      <td>{bytesToMB(file?.size)} MB</td>
                      <td></td>
                      <td>
                        {" "}
                        <MdDelete onClick={() => deleteFile(index)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div>
                <p>
                  Total size of files in queue:{" "}
                  <span style={{ color: "#3871e0" }}>
                    {parseFloat(totalSize.toFixed(2))} MB
                  </span>
                </p>
                <p style={{ color: "red", textAlign: "justify" }}>
                  Any of data that is collected by this site will be kept
                  confidential and we will not disclose it to any third parties.
                  We ensure that your data will be protected and will not be for
                  sale.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropZone;
