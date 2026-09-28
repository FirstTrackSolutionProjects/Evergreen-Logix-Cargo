import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Upload, FileSpreadsheet, Download, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { bulkShipmentsApi, uploadToS3 } from '@/api/bulk-shipments.api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import styles from './BulkShipmentPage.module.css';

const ACCEPTED_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const ACCEPTED_EXT = '.xlsx';

export function BulkShipmentPage() {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleSelect = (selected: File | null) => {
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith(ACCEPTED_EXT)) {
      toast.error('Only .xlsx files are allowed');
      return;
    }
    setFile(selected);
    setProgress(0);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    handleSelect(dropped ?? null);
  };

  const mutation = useMutation({
    mutationFn: async (selectedFile: File) => {
      const { key, url } = await bulkShipmentsApi.getKeyAndUploadUrl();
      setProgress(30);
      await uploadToS3(url, selectedFile);
      setProgress(70);
      await bulkShipmentsApi.bulkCreate(key);
      setProgress(100);
    },
    onSuccess: () => {
      toast.success('Bulk shipments created successfully');
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      setFile(null);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Bulk upload failed');
      setProgress(0);
    },
  });

  const handleUpload = () => {
    if (!file) {
      toast.error('Please select an Excel file first');
      return;
    }
    mutation.mutate(file);
  };

  const isUploading = mutation.isPending;

  return (
    <div className={styles.page}>
      <PageHeader
        title="Bulk Shipments"
        subtitle="Upload an Excel file to create multiple shipments at once."
      />

      <div className={styles.grid}>
        <Card>
          <CardHeader
            title="Upload Excel"
            subtitle="Only .xlsx files following the template are accepted."
          />

          <div
            className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''} ${file ? styles.dropzoneFilled : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !file && inputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_TYPE}
              className={styles.hiddenInput}
              onChange={(e) => handleSelect(e.target.files?.[0] ?? null)}
              disabled={isUploading}
            />

            {file ? (
              <div className={styles.fileCard}>
                <div className={styles.fileIcon}>
                  <FileSpreadsheet size={22} />
                </div>
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileMeta}>
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setProgress(0);
                    if (inputRef.current) inputRef.current.value = '';
                  }}
                  disabled={isUploading}
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className={styles.dropIcon}>
                  <Upload size={26} />
                </div>
                <h4 className={styles.dropTitle}>Drag & drop your Excel file</h4>
                <p className={styles.dropText}>
                  or <span className={styles.dropLink}>browse files</span>
                </p>
                <p className={styles.dropHint}>Accepted format: .xlsx</p>
              </>
            )}
          </div>

          {isUploading && (
            <div className={styles.progressWrapper}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className={styles.progressText}>{progress}% uploaded</span>
            </div>
          )}

          <div className={styles.actions}>
            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={!file || isUploading}
              isLoading={isUploading}
              leftIcon={<Upload size={16} />}
            >
              {isUploading ? 'Uploading…' : 'Upload & Create'}
            </Button>
            {file && !isUploading && (
              <Button
                variant="secondary"
                onClick={() => {
                  setFile(null);
                  setProgress(0);
                  if (inputRef.current) inputRef.current.value = '';
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Instructions" />

          <ol className={styles.instructions}>
            <li>
              <CheckCircle2 size={16} />
              <span>Download the Excel template below.</span>
            </li>
            <li>
              <CheckCircle2 size={16} />
              <span>Fill in every required column — do not rename headers.</span>
            </li>
            <li>
              <CheckCircle2 size={16} />
              <span>Ensure phone numbers are 10 digits, pincodes are 6 digits.</span>
            </li>
            <li>
              <CheckCircle2 size={16} />
              <span>E-waybill (12 digits) is required for shipments valued at ₹50,000 or more.</span>
            </li>
            <li>
              <CheckCircle2 size={16} />
              <span>Save as <strong>.xlsx</strong> and upload here.</span>
            </li>
          </ol>

          <div className={styles.noteBox}>
            <AlertCircle size={16} />
            <span>
              Rows with validation errors will cause the entire file to be rejected.
              Ensure all rows are valid before uploading.
            </span>
          </div>

          <Button
            variant="outline"
            leftIcon={<Download size={16} />}
            onClick={() => toast.success('Template download will be available soon')}
            fullWidth
          >
            Download Template
          </Button>
        </Card>
      </div>
    </div>
  );
}