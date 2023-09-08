import { compose } from '@reduxjs/toolkit';
import { withStore } from './withStore';
import { withRouter } from './withRouter';

export const withProviders = compose(withStore, withRouter);
