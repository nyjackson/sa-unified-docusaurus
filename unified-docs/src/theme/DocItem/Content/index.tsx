import React, {type ReactNode} from 'react';
import Content from '@theme-original/DocItem/Content';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import type ContentType from '@theme/DocItem/Content';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): ReactNode {
  const {frontMatter, metadata} = useDoc()
  console.log("Front Matter Passed ",frontMatter)
  console.log("Metadata Passed ",metadata)

   

  return (
    <>
      <Content {...props} />
    </>
  );
}
