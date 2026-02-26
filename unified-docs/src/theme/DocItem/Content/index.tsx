import React, {type ReactNode} from 'react';
import Content from '@theme-original/DocItem/Content';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type ContentType from '@theme/DocItem/Content';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): ReactNode {
  const {siteConfig, siteMetadata} = useDocusaurusContext()
   // testing
  // console.log(siteConfig)
  // console.log(siteMetadata)
  return (
    <>
      <Content {...props} />
    </>
  );
}
