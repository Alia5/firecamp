import { FC, useState, useEffect } from 'react';
import _compact from 'lodash/compact';
import isEqual from 'react-fast-compare';
import { _misc, _object } from '@firecamp/utils';
import {
  EFirecampAgent,
  EAuthTypes,
  IAuthBearer,
  IAuthAws4,
  IOAuth1,
  IAuthDigest,
  IAuthBasic,
  IAuth,
} from '@firecamp/types';
import {
  AvailableOnElectron,
  Notes,
  Dropdown,
  Button,
  Container,
} from '@firecamp/ui';

import {
  // Atlassion,
  Aws,
  Basic,
  Bearer,
  Digest,
  // Hawk,
  Netrc,
  Ntlm,
  OAuth1,
  OAuth2,
  NoAuth,
  Inherit,
} from './auths';
import { authTypeList } from './constants';

const AuthSetting: FC<IProps> = ({
  value,
  activeAuthType = EAuthTypes.None,
  allowInherit = true,
  onChangeAuthType = () => {},
  onChangeAuthValue = () => {},
  onChangeOAuth2Value = () => {},
  fetchTokenOnChangeOAuth2 = (authPayload: any) => {},
  fetchInheritedAuth = () => {},
  oauth2LastToken = '',
}) => {
  const _authTypeList = allowInherit
    ? [...authTypeList]
    : authTypeList.filter((a) => a.id !== EAuthTypes.Inherit);

  const initialState = {
    isAuthTypesDDOpen: false,
    authTypeMeta: _authTypeList.find((type) => type.id === activeAuthType),
    authTypes: _authTypeList,
  };
  const [state, setState] = useState(initialState);
  const [inheritedAuth, setInheritedAuth] = useState({ parentName: '' });
  const { isAuthTypesDDOpen, authTypeMeta, authTypes } = state;

  useEffect(() => {
    setState((s) => ({
      ...s,
      activeAuthType: _authTypeList.find((type) => type.id === activeAuthType),
    }));
  }, [activeAuthType]);

  const _renderTabBody = () => {
    switch (activeAuthType) {
      case EAuthTypes.None:
        return (
          <NoAuth
            onChangeAuthType={onChangeAuthType}
            authTypeList={_authTypeList}
          />
        );
      case EAuthTypes.Bearer:
        return (
          <Bearer auth={value as IAuthBearer} onChange={onChangeAuthValue} />
        );
      case EAuthTypes.Basic:
        return (
          <Basic auth={value as IAuthBasic} onChange={onChangeAuthValue} />
        );
      case EAuthTypes.Digest:
        return (
          <Digest auth={value as IAuthDigest} onChange={onChangeAuthValue} />
        );
      case EAuthTypes.OAuth1:
        return <OAuth1 auth={value as IOAuth1} onChange={onChangeAuthValue} />;
      case EAuthTypes.OAuth2:
        if (_misc.firecampAgent() === EFirecampAgent.Desktop) {
          return (
            <OAuth2
              auth={value}
              oauth2LastToken={oauth2LastToken}
              onChangeOAuth2Value={onChangeOAuth2Value}
              fetchTokenOnChangeOAuth2={fetchTokenOnChangeOAuth2}
            />
          );
        } else {
          return <AvailableOnElectron name="OAuth2" />;
        }
      case EAuthTypes.Hawk:
        return <></>;
      // <Hawk auth={value} onChange={onChangeAuth} />;
      case EAuthTypes.Aws4:
        return <Aws auth={value as IAuthAws4} onChange={onChangeAuthValue} />;
      case EAuthTypes.Ntlm:
        return (
          <div className="p-3">
            <Notes
              type="info"
              title="Coming soon!!"
              description={`Firecamp team is building this feature and it’ll be releasing very soon. Keep us watching on <span>  <a href="https://github.com/firecamp-io/firecamp/releases" target="_blank">
Github </a>, <a href="https://twitter.com/FirecampHQ" target="_blank">Twitter</a>, <a href="https://discord.com/invite/8hRaqhK" target="_blank"> Discord</a> </span>.`}
            />
          </div>
        );
      /* case EAuthTypes.Atlassian:
        return (
          <Atlassion
            auth={value}
            onChange={onChangeAuth}
          />
        );*/
      case EAuthTypes.Nertc:
        return <Netrc />;
        break;
      case EAuthTypes.Inherit:
        return <Inherit />;
      default:
        return allowInherit ? (
          <Inherit />
        ) : (
          <NoAuth
            onChangeAuthType={onChangeAuthType}
            authTypeList={_authTypeList}
          />
        );
    }
  };

  const _onToggleAuthTypesDD = () => {
    setState((s) => ({
      ...s,
      isAuthTypesDDOpen: !state.isAuthTypesDDOpen,
    }));
  };

  const _onSelectAuthType = (element: {
    id: EAuthTypes;
    name: string;
    enable: boolean;
  }) => {
    setState((s) => ({ ...s, activeAuthType: element }));
    onChangeAuthType(element.id);
  };

  return (
    <Container>
      <Container.Header>
        <div className="tab-pane-body-header flex items-center px-3 py-1 relative z-10">
          <Dropdown
            isOpen={isAuthTypesDDOpen}
            // style={{ width: '115px' }}
            selected={authTypeMeta?.name || ''}
            onToggle={() => _onToggleAuthTypesDD()}
          >
            <Dropdown.Handler>
              <Button
                text={authTypeMeta?.name || ''}
                className="font-bold"
                transparent
                withCaret
                primary
                ghost
                xs
              />
            </Dropdown.Handler>
            <Dropdown.Options
              options={authTypes}
              onSelect={(element) => _onSelectAuthType(element)}
            />
          </Dropdown>
        </div>
      </Container.Header>
      <Container.Body>
        <div className="p-4 max-w-xl">{_renderTabBody()}</div>
      </Container.Body>
    </Container>
  );
};

export default AuthSetting;

export interface IProps {
  /**
   * auth value
   */
  value: IAuth['value'];

  /**
   * active auth among all auth
   */
  activeAuthType: string;

  /**
   * a boolean value to state whether you want to allow to inherit auth from parent or not
   */
  allowInherit?: boolean;

  /**
   * passes updated auth value in to parent component
   */
  onChangeAuthValue: (
    authType: EAuthTypes,
    updates: { key: string; value: any } | any
  ) => void;

  /**
   * update active auth value
   */
  onChangeAuthType: (authType: EAuthTypes) => Promise<any> | any;

  /**
   * update auth value for auth type OAuth2
   */
  onChangeOAuth2Value: (key: string, updates: any) => void;

  /**
   * fetch OAuth2 token
   */
  fetchTokenOnChangeOAuth2?: (options: any) => void;

  /**
   * fetch inherited auth from parent
   */
  fetchInheritedAuth?: () => Promise<any> | any;

  oauth2LastToken?: string;
}
