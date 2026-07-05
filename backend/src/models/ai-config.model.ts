import { supabase } from '../db/supabase.js';

export interface AiConfig {
  id: string;
  user_id: string;
  provider: string;
  api_key: string;
  model: string;
  created_at: string;
  updated_at: string;
}

export interface AiConfigPayload {
  provider?: string;
  api_key: string;
  model?: string;
}

export interface AiConfigPublic {
  id: string;
  user_id: string;
  provider: string;
  model: string;
  has_key: boolean;
  created_at: string;
  updated_at: string;
}

const TABLE = 'ai_configs';

const aiConfigModel = {
  async getByUserId(userId: string): Promise<AiConfig | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  },

  async getPublic(userId: string): Promise<AiConfigPublic | null> {
    const config = await this.getByUserId(userId);
    if (!config) return null;

    return {
      id: config.id,
      user_id: config.user_id,
      provider: config.provider,
      model: config.model,
      has_key: !!config.api_key,
      created_at: config.created_at,
      updated_at: config.updated_at,
    };
  },

  async upsert(userId: string, payload: AiConfigPayload): Promise<AiConfig> {
    const { data, error } = await supabase
      .from(TABLE)
      .upsert(
        {
          user_id: userId,
          provider: payload.provider || 'openai',
          api_key: payload.api_key,
          model: payload.model || 'gpt-4o-mini',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async remove(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('user_id', userId);

    if (error) return false;
    return true;
  },
};

export default aiConfigModel;
