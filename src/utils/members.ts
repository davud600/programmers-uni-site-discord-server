import { API_SERVER_LINK } from '../config/index';
import axios from 'axios';
import { Member } from '../interfaces/members.interface';

const apiLink = `${API_SERVER_LINK}/api/members`;

const headers = {
  'Content-Type': 'application/json',
};

export default class MembersService {
  static async warnMember(id: number): Promise<void> {
    try {
      await axios.post(`${apiLink}/warn/${id}`);
    } catch (err) {
      console.error(err);
    }
  }

  static async removeMember(id: number): Promise<void> {
    try {
      await axios.post(`${apiLink}/warn/${id}`);
    } catch (err) {
      console.error(err);
    }
  }

  static async getMembersToWarn(): Promise<Member[]> {
    let members: Member[] = [];

    try {
      ({ data: members } = await axios.get(`${apiLink}/warn/get`, {
        headers,
      }));
    } catch (err) {
      console.error(err);
    }

    return members;
  }

  static async getMembersToDowngrade(): Promise<Member[]> {
    let members: Member[] = [];

    try {
      ({ data: members } = await axios.get(`${apiLink}/downgrade/get`, {
        headers,
      }));
    } catch (err) {
      console.error(err);
    }

    return members;
  }

  static async getMembersToUpgrade(): Promise<Member[]> {
    let members: Member[] = [];

    try {
      ({ data: members } = await axios.get(`${apiLink}/upgrade/get`, {
        headers,
      }));
    } catch (err) {
      console.error(err);
    }

    return members;
  }
}
