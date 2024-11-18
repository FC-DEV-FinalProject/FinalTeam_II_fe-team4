/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * AIPark API
 * 기업연계 파이널 프로젝트 API 문서 백엔드 개발용
 * OpenAPI spec version: 1.0.0
 */
import type {
  ConvertMultipleAudiosBody,
  ConvertMultipleVoicesBody,
  ConvertMultipleVoicesParams,
  ConvertSingleTextParams,
  DownloadFileParams,
  DownloadGeneratedAudio1Params,
  DownloadGeneratedAudio2Params,
  DownloadGeneratedAudio3Params,
  DownloadGeneratedAudio4Params,
  DownloadGeneratedAudioParams,
  ResponseDto,
  TestFailParams,
  TTSSaveDto,
  UploadConcatBody,
  UploadConcatParams,
  UploadFiles1Body,
  UploadFiles1Params,
  UploadFilesBody,
  UploadFilesParams,
  UploadTargetAudioBody,
  UploadUnit1Body,
  UploadUnit1Params,
  UploadUnitBody,
  UploadUnitParams,
  VCSaveDto,
} from './aIParkAPI.schemas';
import { customInstance } from './axios-client';

/**
 * VC 프로젝트 상태를 가져옵니다.
 * @summary VC 상태 로드
 */
export const vcSave = (projectId: number, vCSaveDto: VCSaveDto) => {
  return customInstance<ResponseDto>({
    url: `/vc/${projectId}/save`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: vCSaveDto,
  });
};

/**
 * 사용자가 업로드한 타겟 오디오 파일을 사용하여 Voice ID를 생성합니다.
 * @summary 타겟 오디오 업로드 및 Voice ID 생성
 */
export const uploadTargetAudio = (uploadTargetAudioBody: UploadTargetAudioBody) => {
  const formData = new FormData();
  formData.append('targetAudio', uploadTargetAudioBody.targetAudio);

  return customInstance<ResponseDto>({
    url: `/vc/target/upload`,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
  });
};

/**
 * 사용자가 업로드한 여러 소스 오디오 파일을 타겟 Voice ID로 변환합니다.
 * @summary 여러 소스 오디오 파일 변환 요청
 */
export const convertMultipleVoices = (
  convertMultipleVoicesBody: ConvertMultipleVoicesBody,
  params: ConvertMultipleVoicesParams
) => {
  const formData = new FormData();
  convertMultipleVoicesBody.sourceAudios.forEach((value) => formData.append('sourceAudios', value));

  return customInstance<ResponseDto>({
    url: `/vc/convert/batch`,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
    params,
  });
};

/**
 * TTS 프로젝트 상태를 저장합니다.
 * @summary TTS 상태 저장
 */
export const ttsSave = (projectId: number, tTSSaveDto: TTSSaveDto) => {
  return customInstance<ResponseDto>({
    url: `/tts/${projectId}/save`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: tTSSaveDto,
  });
};

/**
 * 유닛 오디오를 S3 버킷에 저장하고 메타데이터를 DB에 저장하는 api입니다.<br><br>매개변수 : <br>- 유닛 id, <br>- 프로젝트 id, <br>- 프로젝트 타입 (TTS, VC, Concat), <br>- 오디오 파일
 * @summary 유닛(TTS or VC) 오디오 업로드
 */
export const uploadUnit = (uploadUnitBody: UploadUnitBody, params: UploadUnitParams) => {
  const formData = new FormData();
  formData.append('file', uploadUnitBody.file);

  return customInstance<ResponseDto>({
    url: `/tts/upload-generated-audio-to-bucket`,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
    params,
  });
};

/**
 * 유닛 오디오를 S3 버킷에 저장하고 메타데이터를 DB에 저장하는 api입니다.<br><br>매개변수 : <br>- 유닛 id, <br>- 프로젝트 id, <br>- 프로젝트 타입 (TTS, VC, Concat), <br>- 오디오 파일
 * @summary 유닛(TTS or VC) 오디오 업로드
 */
export const uploadUnit1 = (uploadUnit1Body: UploadUnit1Body, params: UploadUnit1Params) => {
  const formData = new FormData();
  formData.append('file', uploadUnit1Body.file);

  return customInstance<ResponseDto>({
    url: `/vc/upload-generated-audio-to-bucket`,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
    params,
  });
};

/**
 * Google TTS API를 사용하여 개별 텍스트를 WAV 형식으로 변환합니다.

매개변수:
- text: 변환할 텍스트 (예: '안녕하세요')
- languageCode: 언어 코드 (예: 'ko-KR', 'en-US')
- gender: 성별 ('male', 'female', 'neutral')
- speed: 말하는 속도 (범위: 0.25 ~ 4.0, 기본값: 1.0)
- volume: 볼륨 조정 (범위: -96.0 ~ 16.0 데시벨, 기본값: 0.0)
- pitch: 음의 높낮이 (범위: -20.0 ~ 20.0, 기본값: 0.0)
- id: 변환하고자 하는 tts_Detail ID 값 (예: 1, 2, 3, ...)
 * @summary Convert Single Text to WAV
 */
export const convertSingleText = (params: ConvertSingleTextParams) => {
  return customInstance<ResponseDto>({ url: `/tts/convert/single`, method: 'POST', params });
};

/**
 * 여러 텍스트 세그먼트를 한꺼번에 WAV 형식으로 변환합니다.

매개변수:
- text: 변환할 텍스트 세그먼트 리스트 (JSON 형식)
  - text: 변환할 텍스트 (예: 'Hello')
  - languageCode: 언어 코드 (예: 'en-US')
  - gender: 성별 ('male', 'female', 'neutral')
  - speed: 말하는 속도 (범위: 0.25 ~ 4.0, 기본값: 1.0)
  - volume: 볼륨 조정 (범위: -96.0 ~ 16.0 데시벨, 기본값: 0.0)
  - pitch: 음의 높낮이 (범위: -20.0 ~ 20.0, 기본값: 0.0)
 * @summary Convert Batch of Texts to WAV
 */
export const convertBatchTexts = (convertBatchTextsBody: number[]) => {
  return customInstance<ResponseDto>({
    url: `/tts/convert/batch`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: convertBatchTextsBody,
  });
};

/**
 * VC, CONCAT으로 변환할 오디오를 클라이언트 로컬컴퓨터로부터 버킷에 저장하는 api입니다.<br><br>매개변수:<br>- 파일, <br>- 멤버Id, <br>- projectId, <br>- audioType<br>오디오 타입이 VC_TRG일 경우 마지막 매개변수로 voiceId를 입력합니다.
 * @summary 유저가 가지고 있는 오디오를 버킷에 저장
 */
export const uploadFiles = (uploadFilesBody: UploadFilesBody, params: UploadFilesParams) => {
  const formData = new FormData();
  uploadFilesBody.files.forEach((value) => formData.append('files', value));

  return customInstance<ResponseDto>({
    url: `/vc/upload-local-to-bucket`,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
    params,
  });
};

/**
 * VC, CONCAT으로 변환할 오디오를 클라이언트 로컬컴퓨터로부터 버킷에 저장하는 api입니다.<br><br>매개변수:<br>- 파일, <br>- 멤버Id, <br>- projectId, <br>- audioType<br>오디오 타입이 VC_TRG일 경우 마지막 매개변수로 voiceId를 입력합니다.
 * @summary 유저가 가지고 있는 오디오를 버킷에 저장
 */
export const uploadFiles1 = (uploadFiles1Body: UploadFiles1Body, params: UploadFiles1Params) => {
  const formData = new FormData();
  uploadFiles1Body.files.forEach((value) => formData.append('files', value));

  return customInstance<ResponseDto>({
    url: `/concat/upload-local-to-bucket`,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
    params,
  });
};

/**
 * 컨캣 오디오를 S3 버킷에 저장하고 메타데이터를 DB에 저장하는 api입니다.<br><br>매개변수 : <br>- 프로젝트 id, <br>- 오디오 파일
 * @summary Concat 오디오 업로드
 */
export const uploadConcat = (uploadConcatBody: UploadConcatBody, params: UploadConcatParams) => {
  const formData = new FormData();
  formData.append('file', uploadConcatBody.file);

  return customInstance<ResponseDto>({
    url: `/concat/upload-generated-audio-to-bucket`,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
    params,
  });
};

export const convertMultipleAudios = (convertMultipleAudiosBody: ConvertMultipleAudiosBody) => {
  const formData = new FormData();
  convertMultipleAudiosBody.sourceAudios.forEach((value) => formData.append('sourceAudios', value));

  return customInstance<ResponseDto>({
    url: `/concat/convert/batch`,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
  });
};

/**
 * VC 프로젝트 상태를 가져옵니다.
 * @summary VC 상태 로드
 */
export const ttsLoad = (projectId: number) => {
  return customInstance<ResponseDto>({ url: `/vc/${projectId}`, method: 'GET' });
};

/**
 * TTS 프로젝트 상태를 가져옵니다.
 * @summary TTS 상태 로드
 */
export const ttsLoad1 = (projectId: number) => {
  return customInstance<ResponseDto>({ url: `/tts/${projectId}`, method: 'GET' });
};

/**
 * 변환된 WAV 파일을 다운로드합니다.

매개변수:
- path: 다운로드할 WAV 파일의 경로 (예: 'output/tts_output_123456.wav')
 * @summary Download Converted WAV File
 */
export const downloadFile = (params: DownloadFileParams) => {
  return customInstance<Blob>({
    url: `/tts/converted/download`,
    method: 'GET',
    params,
    responseType: 'blob',
  });
};

export const testSuccess = () => {
  return customInstance<ResponseDto>({ url: `/test/success`, method: 'GET' });
};

export const testFail = (params: TestFailParams) => {
  return customInstance<ResponseDto>({ url: `/test/fail`, method: 'GET', params });
};

/**
 * 오디오를 S3 버킷으로부터 다운로드 받을수 있는 URL을 제공하는 API 입니다.<br><br>매개변수:<br>- 버킷 경로
 * @summary 버킷에 있는 오디오 다운로드
 */
export const downloadGeneratedAudio = (params: DownloadGeneratedAudioParams) => {
  return customInstance<ResponseDto>({
    url: `/tts/download-generated-audio-from-bucket`,
    method: 'GET',
    params,
  });
};

/**
 * 오디오를 S3 버킷으로부터 다운로드 받을수 있는 URL을 제공하는 API 입니다.<br><br>매개변수:<br>- 버킷 경로
 * @summary 버킷에 있는 오디오 다운로드
 */
export const downloadGeneratedAudio1 = (params: DownloadGeneratedAudio1Params) => {
  return customInstance<ResponseDto>({
    url: `/vc/download-to-generate-audio-from-bucket`,
    method: 'GET',
    params,
  });
};

/**
 * 오디오를 S3 버킷으로부터 다운로드 받을수 있는 URL을 제공하는 API 입니다.<br><br>매개변수:<br>- 버킷 경로
 * @summary 버킷에 있는 오디오 다운로드
 */
export const downloadGeneratedAudio2 = (params: DownloadGeneratedAudio2Params) => {
  return customInstance<ResponseDto>({
    url: `/vc/download-generated-audio-from-bucket`,
    method: 'GET',
    params,
  });
};

/**
 * 오디오를 S3 버킷으로부터 다운로드 받을수 있는 URL을 제공하는 API 입니다.<br><br>매개변수:<br>- 버킷 경로
 * @summary 버킷에 있는 오디오 다운로드
 */
export const downloadGeneratedAudio3 = (params: DownloadGeneratedAudio3Params) => {
  return customInstance<ResponseDto>({
    url: `/concat/download-generated-audio-from-bucket`,
    method: 'GET',
    params,
  });
};

/**
 * 오디오를 S3 버킷으로부터 다운로드 받을수 있는 URL을 제공하는 API 입니다.<br><br>매개변수:<br>- 버킷 경로
 * @summary 버킷에 있는 오디오 다운로드
 */
export const downloadGeneratedAudio4 = (params: DownloadGeneratedAudio4Params) => {
  return customInstance<ResponseDto>({
    url: `/concat/download-to-generate-audio-from-bucket`,
    method: 'GET',
    params,
  });
};

export type VcSaveResult = NonNullable<Awaited<ReturnType<typeof vcSave>>>;
export type UploadTargetAudioResult = NonNullable<Awaited<ReturnType<typeof uploadTargetAudio>>>;
export type ConvertMultipleVoicesResult = NonNullable<
  Awaited<ReturnType<typeof convertMultipleVoices>>
>;
export type TtsSaveResult = NonNullable<Awaited<ReturnType<typeof ttsSave>>>;
export type UploadUnitResult = NonNullable<Awaited<ReturnType<typeof uploadUnit>>>;
export type UploadUnit1Result = NonNullable<Awaited<ReturnType<typeof uploadUnit1>>>;
export type ConvertSingleTextResult = NonNullable<Awaited<ReturnType<typeof convertSingleText>>>;
export type ConvertBatchTextsResult = NonNullable<Awaited<ReturnType<typeof convertBatchTexts>>>;
export type UploadFilesResult = NonNullable<Awaited<ReturnType<typeof uploadFiles>>>;
export type UploadFiles1Result = NonNullable<Awaited<ReturnType<typeof uploadFiles1>>>;
export type UploadConcatResult = NonNullable<Awaited<ReturnType<typeof uploadConcat>>>;
export type ConvertMultipleAudiosResult = NonNullable<
  Awaited<ReturnType<typeof convertMultipleAudios>>
>;
export type TtsLoadResult = NonNullable<Awaited<ReturnType<typeof ttsLoad>>>;
export type TtsLoad1Result = NonNullable<Awaited<ReturnType<typeof ttsLoad1>>>;
export type DownloadFileResult = NonNullable<Awaited<ReturnType<typeof downloadFile>>>;
export type TestSuccessResult = NonNullable<Awaited<ReturnType<typeof testSuccess>>>;
export type TestFailResult = NonNullable<Awaited<ReturnType<typeof testFail>>>;
export type DownloadGeneratedAudioResult = NonNullable<
  Awaited<ReturnType<typeof downloadGeneratedAudio>>
>;
export type DownloadGeneratedAudio1Result = NonNullable<
  Awaited<ReturnType<typeof downloadGeneratedAudio1>>
>;
export type DownloadGeneratedAudio2Result = NonNullable<
  Awaited<ReturnType<typeof downloadGeneratedAudio2>>
>;
export type DownloadGeneratedAudio3Result = NonNullable<
  Awaited<ReturnType<typeof downloadGeneratedAudio3>>
>;
export type DownloadGeneratedAudio4Result = NonNullable<
  Awaited<ReturnType<typeof downloadGeneratedAudio4>>
>;
