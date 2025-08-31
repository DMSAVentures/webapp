import React, {useState, useRef} from 'react';
import styles from './fileuploadarea.module.scss';
import 'remixicon/fonts/remixicon.css';
import {Button} from "@/components/simpleui/Button/button";

interface FileUploadAreaProps {
    onFileUpload: (file: File) => void;
    variant: 'light' | 'gray';
}

const FileUploadArea: React.FC<FileUploadAreaProps> = (props: FileUploadAreaProps) => {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleDrag = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            console.log(e.dataTransfer.files);
            // handle files here
            props.onFileUpload(e.dataTransfer.files[0])
            setFileName(e.dataTransfer.files[0].name);
            inputRef.current?.blur();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            console.log(e.target.files);
            // handle files here
            props.onFileUpload(e.target.files[0])
            setFileName(e.target.files[0].name);
            inputRef.current?.blur();
        }
    };

    const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent form submission
        inputRef.current?.click();
    };

    return (
            <form id="form-file-upload" className={`${styles['file-upload-area']} ${styles[`file-upload-area--${props.variant}`]}`} onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}>
                <input
                    ref={inputRef}
                    type="file"
                    id="input-file-upload"
                    className={styles['file-upload-input']}
                    multiple={true}
                    onChange={handleChange}
                />
                <label
                    id="label-file-upload"
                    htmlFor="input-file-upload"
                    className={`${styles['file-upload-area__container']} ${dragActive ? styles['drag-active'] : ''}`}
                >
                    <i className={`${styles['fileuploadarea__icon']} ri-upload-cloud-line`}></i>
                    <div className={styles['fileuploadarea__title']}>Choose a file or drag & drop it here.
                        <p className={styles['fileuploadarea_supported_meta']}>JPEG, PNG, PDF, and MP4 formats, up to 50 MB.</p>
                    </div>
                    <Button type={'button'} variant={'secondary'} onClick={onButtonClick}>Browse</Button>
                    {fileName && <p className={styles['fileuploadarea__filename']}>{fileName}</p>}
                </label>

            </form>);
};

export default FileUploadArea;
