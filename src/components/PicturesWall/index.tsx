/* eslint-disable react/destructuring-assignment */
import React from "react";
import { Icon, Modal } from "antd";
import _isString from "lodash/isString";
import _isArray from "lodash/isArray";
import CustomUpload, {
  processFileList,
  filterFileList,
  setFileList,
  CustomUploadPorps,
} from "../Upload/index";
import { picturesWallLacale } from '../../locale';
import { imageFormatLimit } from '../../config';
import { getBase64 } from '../../utils';
import styles from "./index.less";

export function getPicturesLink(fileList) {
  if (_isArray(fileList) && fileList.length === 1) {
    return fileList[0].url;
  }
  if (_isArray(fileList)) {
    return fileList.map(item => item.url);
  }
  return fileList;
}

export interface PicturesWallProps extends CustomUploadPorps {
  value?: string | any[];
}

export interface PicturesWallState {
  previewVisible: boolean;
  previewImage: string;
  fileList: any[];
}

class PicturesWall extends React.Component<PicturesWallProps, PicturesWallState> {
  static getDerivedStateFromProps(props: PicturesWallProps) {
    return {
      fileList: setFileList(props)
    };
  }

  constructor(props: PicturesWallProps) {
    super(props);
    // console.log(props.value);
    this.state = {
      previewVisible: false,
      previewImage: "",
      fileList:
        props.value && _isString(props.value)
          ? [{ uid: -1, url: props.value }]
          : []
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    console.log(fileList);
    const { onChange } = this.props;
    const formatFiles = processFileList(fileList);
    if (onChange) {
      onChange(filterFileList(formatFiles));
    }
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{picturesWallLacale.upload}</div>
      </div>
    );
    return (
      <div className={`${styles.pictureWall} clearfix`}>
        <CustomUpload
          {...this.props}
          accept={imageFormatLimit}
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          listType="picture-card"
        >
          {fileList.length >= (this.props.filesCountLimit || 1)  ? null : uploadButton}
        </CustomUpload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;